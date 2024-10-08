import React from 'react';
import Image from 'next/image';

const events = [
  {
    date: 'Oct. 14, 2024',
    time: '5:00 PM',
    title: 'Join the Fun: Unity, GitHub & Quest 3 Demos',
    description: `We’ll dive into installing Unity, mastering GitHub, and collaborating on exciting new ideas. Plus, we’ll have multiple Quest 3 headsets ready for demo, so be sure to bring your laptops and join the fun!\nLet’s brainstorm, create, and explore together! 🚀`,
    location: 'University Library - Lower Level Room 005',
    image: '/images/gbm2.png',
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
            <div key={index} className="bg-beige rounded shadow">
              <Image
                src={event.image}
                alt={event.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-700 mb-2">
                  {event.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <p className="text-gray-600">Date: {event.date}</p>
                <p className="text-gray-600">Time: {event.time}</p>
                <p className="text-gray-600">Location: {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
