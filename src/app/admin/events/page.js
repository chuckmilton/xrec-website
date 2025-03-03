"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../utils/supabaseClient";

// Converts a military time string (HH:MM) to a 12-hour time string with AM/PM.
function convertMilitaryTo12(timeStr) {
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute}${ampm}`;
}

// Converts a 12-hour time string (e.g. "2:30PM" or "2:30 PM") to 24-hour time (HH:MM).
function convertTo24Hour(timeStr) {
  const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const match = timeStr.match(regex);
  if (match) {
    let [, hours, minutes, modifier] = match;
    hours = parseInt(hours, 10);
    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
  // Fallback: if it doesn't match, assume it's already in 24-hour format.
  return timeStr;
}

// Converts a date from "mm/dd/yyyy" to "yyyy-mm-dd" (for input fields).
function convertDateForInput(dateStr) {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Format the form data before sending to Supabase.
// Converts date from "yyyy-mm-dd" (input format) to "mm/dd/yyyy" and time from 24-hour to 12-hour.
function formatFormData(form) {
  // Convert date.
  const [year, month, day] = form.date.split("-");
  const formattedDate = `${month}/${day}/${year}`;
  // Convert time.
  const formattedTime = convertMilitaryTo12(form.time);
  return { ...form, date: formattedDate, time: formattedTime };
}

// Helper function to generate Google Calendar event URL.
// Expects event.date in "mm/dd/yyyy" and event.time in "h:mm AM/PM".
function getGoogleCalendarLink(event) {
  // Split the date.
  const dateParts = event.date.split("/");
  if (dateParts.length !== 3) {
    console.error("Invalid date format. Expected mm/dd/yyyy", event.date);
    return "#";
  }
  const [month, day, year] = dateParts;
  // Rearrange into ISO date format: yyyy-mm-dd.
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  // Convert the stored 12-hour time into 24-hour.
  let timeString = event.time;
  if (
    timeString.toUpperCase().includes("AM") ||
    timeString.toUpperCase().includes("PM")
  ) {
    timeString = convertTo24Hour(timeString);
  }
  
  // Build a string that can be parsed by Date.
  const dateTimeStr = `${isoDate}T${timeString}:00`;
  let startDateTime = new Date(dateTimeStr);
  if (isNaN(startDateTime.getTime())) {
    console.error("Invalid date/time for event:", event);
    startDateTime = new Date();
  }
  
  // End time: 1 hour later.
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
  
  // Format the dates for Google Calendar (YYYYMMDDTHHmmssZ).
  function formatDate(date) {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  }
  
  const formattedStart = formatDate(startDateTime);
  const formattedEnd = formatDate(endDateTime);
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.location);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStart}/${formattedEnd}&details=${details}&location=${location}&sf=true&output=xml`;
}

// Helper to format date/time for display in the event list.
// Expects date in "yyyy-mm-dd" and time in "HH:MM" (24-hour).
const formatDateTime = (dateStr, timeStr) => {
  const dateObj = new Date(`${dateStr}T${timeStr}`);
  if (isNaN(dateObj.getTime())) return "";
  const formattedDate = dateObj.toLocaleDateString("en-US"); // mm/dd/yyyy
  // Use a regex that removes the space between minutes and the AM/PM indicator.
  const formattedTime = dateObj
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/(\d+:\d+)\s+(AM|PM)/, "$1$2");
  return `${formattedDate} at ${formattedTime}`;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Protect route: redirect if not logged in.
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) window.location.href = "/admin/login";
    }
    checkSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = "/admin/login";
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch events when component mounts.
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data);
    }
  };

  // Helper: Extract file name from the public URL.
  const getFileNameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/public/");
    if (parts.length < 2) return null;
    const path = parts[1];
    const bucketPrefix = "event-images/";
    if (path.startsWith(bucketPrefix)) {
      return path.substring(bucketPrefix.length);
    }
    return path;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // File upload handler for event image.
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName; 
    const { error } = await supabase.storage
      .from("event-images")
      .upload(filePath, file, { upsert: true, contentType: file.type });
    
    if (error) {
      console.error("Error uploading file:", error.message);
      setUploading(false);
      return;
    }
    
    const { data, error: publicUrlError } = supabase.storage
      .from("event-images")
      .getPublicUrl(filePath);
    
    if (publicUrlError) {
      console.error("Error getting public URL:", publicUrlError.message);
    } else if (data && data.publicUrl) {
      let fixedUrl = data.publicUrl;
      if (fixedUrl.startsWith("https:/") && !fixedUrl.startsWith("https://")) {
        fixedUrl = fixedUrl.replace("https:/", "https://");
      }
      if (fixedUrl.startsWith("http://www.xrengineering.club/")) {
        fixedUrl = fixedUrl.replace("https://www.xrengineering.club/", "");
      }
      console.log("File uploaded. Public URL:", fixedUrl);
      setForm((prev) => ({ ...prev, image: fixedUrl }));
    }
    setUploading(false);
  };

  // Delete file from storage (for event-images bucket)
  const deleteFileFromStorage = async (url) => {
    const fileName = getFileNameFromUrl(url);
    if (!fileName) return;
    const { error } = await supabase.storage
      .from("event-images")
      .remove([fileName]);
    if (error) {
      console.error("Error deleting file from storage:", error.message);
    } else {
      console.log(`Deleted file ${fileName} from storage.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedForm = formatFormData(form);
    if (editingEvent) {
      if (editingEvent.image && editingEvent.image !== formattedForm.image) {
        await deleteFileFromStorage(editingEvent.image);
      }
      const { error } = await supabase
        .from("events")
        .update(formattedForm)
        .eq("id", editingEvent.id);
      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from("events").insert(formattedForm);
      if (error) console.error("Insert error:", error);
    }
    setForm({ title: "", description: "", date: "", time: "", location: "", image: "" });
    setEditingEvent(null);
    fetchEvents();
  };

  // When editing, convert stored "mm/dd/yyyy" date to "yyyy-mm-dd" and 12-hour time to 24-hour.
  const handleEdit = (eventItem) => {
    const formattedDateForInput = convertDateForInput(eventItem.date);
    const formattedTimeForInput =
      eventItem.time.toUpperCase().includes("AM") ||
      eventItem.time.toUpperCase().includes("PM")
        ? convertTo24Hour(eventItem.time)
        : eventItem.time;
    setForm({ ...eventItem, date: formattedDateForInput, time: formattedTimeForInput });
    setEditingEvent(eventItem);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const eventToDelete = events.find((ev) => ev.id === id);
    if (eventToDelete && eventToDelete.image) {
      await deleteFileFromStorage(eventToDelete.image);
    }
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Event Form Card */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingEvent ? "Update Event" : "Add New Event"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Event Title:</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Event Description:</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Event Description"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Event Date:</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Event Time:</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Event Location:</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Event Location"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Event Image:</label>
              {form.image && (
                <div className="mb-2">
                  <img
                    src={form.image}
                    alt="Event"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded"
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
          </form>
        </div>

        {/* Event List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Existing Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-600">No events found.</p>
          ) : (
            events.map((eventItem) => (
              <div key={eventItem.id} className="border-b last:border-0 py-4">
                <h3 className="text-xl font-semibold">{eventItem.title}</h3>
                <p className="text-gray-700">{eventItem.description}</p>
                <p className="text-gray-600 mt-1">
                  {formatDateTime(
                    // Convert stored "mm/dd/yyyy" back to "yyyy-mm-dd" for display.
                    (() => {
                      const [month, day, year] = eventItem.date.split("/");
                      return `${year}-${month}-${day}`;
                    })(),
                    // Convert stored 12-hour time to 24-hour for formatting.
                    (() => {
                      if (
                        eventItem.time.toUpperCase().includes("AM") ||
                        eventItem.time.toUpperCase().includes("PM")
                      ) {
                        return convertTo24Hour(eventItem.time);
                      }
                      return eventItem.time;
                    })()
                  )}{" "}
                  &bull; {eventItem.location}
                </p>
                {eventItem.image && (
                  <div className="mt-2">
                    <img
                      src={eventItem.image}
                      alt={eventItem.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => handleEdit(eventItem)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(eventItem.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
