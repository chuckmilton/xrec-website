"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) window.location.href = "/admin/login";
      }
    );
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
  // Expected URL: https://<project_id>.supabase.co/storage/v1/object/public/event-images/<fileName>
  const getFileNameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/public/");
    if (parts.length < 2) return null;
    // parts[1] should be "event-images/<fileName>"
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

    // Create a unique file name.
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName; // No folder prefix used
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
      // Fix URL if it starts with "https:/" (one slash) instead of "https://"
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
    if (editingEvent) {
      // If updating and a new image was uploaded, delete the previous file.
      if (editingEvent.image && editingEvent.image !== form.image) {
        await deleteFileFromStorage(editingEvent.image);
      }
      const { error } = await supabase
        .from("events")
        .update(form)
        .eq("id", editingEvent.id);
      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from("events").insert(form);
      if (error) console.error("Insert error:", error);
    }
    setForm({ title: "", description: "", date: "", time: "", location: "", image: "" });
    setEditingEvent(null);
    fetchEvents();
  };

  const handleEdit = (eventItem) => {
    setForm(eventItem);
    setEditingEvent(eventItem);
    // Scroll to the top where the form is located
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    // Find the event being deleted
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
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="Event Date"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Event Time:</label>
                <input
                  type="text"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="Event Time"
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
                  {eventItem.date} at {eventItem.time} &bull; {eventItem.location}
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
