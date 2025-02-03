"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabaseClient";

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
                // For debugging, you can try switching to a plain <img> tag:
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
                // Or, try this:
                // <img
                //   src={event.image}
                //   alt={event.title}
                //   style={{ width: "600px", height: "400px", objectFit: "cover" }}
                // />
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
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
