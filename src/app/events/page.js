"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabaseClient";

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
  return timeStr;
}

// Generates a Google Calendar event URL for the given event.
function getGoogleCalendarLink(event) {
  const dateParts = event.date.split("/");
  if (dateParts.length !== 3) {
    console.error("Invalid date format. Expected mm/dd/yyyy", event.date);
    return "#";
  }
  const [month, day, year] = dateParts;
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  let timeString = event.time;
  if (
    timeString.toUpperCase().includes("AM") ||
    timeString.toUpperCase().includes("PM")
  ) {
    timeString = convertTo24Hour(timeString);
  }
  
  // Build a datetime string in ISO format.
  const dateTimeStr = `${isoDate}T${timeString}:00`;
  let startDateTime = new Date(dateTimeStr);
  if (isNaN(startDateTime.getTime())) {
    console.error("Invalid date/time for event:", event);
    startDateTime = new Date();
  }
  
  // End time is set to 1 hour later.
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  // Helper to format the date for Google Calendar.
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

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setIsVisible(true);
    }
  }, [events]);

  if (loading) {
    return <div className="p-8">Loading events...</div>;
  }

  return (
    <div>
      <main className="p-8 text-gray-900">
        <h2 className="text-5xl font-semibold mb-8 text-beige">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className={`bg-beige rounded shadow flex flex-col h-full transform transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[-100%]"
              }`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              {event.image && (
                <Image
                  loader={({ src }) => src}
                  unoptimized
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover rounded-t"
                  loading="lazy"
                />
              )}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-700 mb-2 flex-grow">
                  {event.description.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <p className="text-gray-600">Date: {event.date}</p>
                  <p className="text-gray-600">Time: {event.time}</p>
                  <p className="text-gray-600">Location: {event.location}</p>
                </div>
                <div className="mt-4">
                  <a
                    href={getGoogleCalendarLink(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                  >
                    Add to Google Calendar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
