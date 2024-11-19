import React from 'react';
import Image from 'next/image';

const events = [
  {
    "date": "Nov. 22, 2024",
    "time": "4:00 PM",
    "title": "Drone ESC Soldering Workshop",
    "description": "Join us this Wednesday as we solder the Drone's ESC components! Soldering irons and FC Practice Boards will be provided so everyone can practice and perfect their soldering skills before working on the ESC together. We'll also cover how the FC and ESC work with their connections and roles in the Drone. 🎯\n\nAfter break, we'll have a meeting on BetaFlight to get the Drone flying!",
    "location": "University Library - Lower Level Room 005 (iSpace)",
    "image": "/images/solder.png"
  },  
  {
    "date": "Nov. 4, 2024",
    "time": "5:00 PM",
    "title": "VR Club Project Kick-Off & Unity Prep Session",
    "description": "Join us on Discord as we kick off our VR Club projects! Be sure to check in with your project lead if you haven’t already and watch the tutorial video in resources to get familiar with Unity. 🎥✨\n\nCome prepared with project ideas so you can dive right into your work.",
    "location": "Online (Discord)",
    "image": "/images/event2.png"
  },
  {
    date: 'Oct. 14, 2024',
    time: '5:00 PM',
    title: 'Join the Fun: Unity, GitHub & Quest 3 Demos',
    description: `We’ll dive into installing Unity, mastering GitHub, and collaborating on exciting new ideas. Plus, we’ll have multiple Quest 3 headsets ready for demo, so be sure to bring your laptops and join the fun!\nLet’s brainstorm, create, and explore together! 🚀`,
    location: 'University Library - Lower Level Room 005',
    image: '/images/official_meeting.png',
  },
  // Add more events as needed
]

export default function Events() {
  return (
    <div>
      <main className="p-8 text-gray-900">
        <h2 className="text-5xl font-semibold mb-8 text-beige">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={index} className="bg-beige rounded shadow flex flex-col h-full">
              <Image
                src={event.image}
                alt={event.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-700 mb-2 flex-grow">
                  {event.description.split('\n').map((line, i) => (
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
