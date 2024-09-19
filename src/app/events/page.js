// app/events/page.js
import Navbar from '../components/Navbar'
import Image from 'next/image'

const events = [
  {
    date: 'September 27, 2024',
    title: 'General Body Meeting',
    description: 'Come join us and get to know officers!',
    location: 'ECS 115',
    image: '../images/ecs.jpg', // Ensure this image exists in your public/images directory
  },
  // Add more events as needed
]

export default function Events() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h2 className="text-3xl mb-6">Upcoming Events</h2>
        {events.map((event, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-2xl mb-2">{event.title}</h3>
            <p className="text-gray-600">
              {event.date} &middot; {event.location}
            </p>
            <div className="mt-4 flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="object-cover rounded shadow"
                />
              </div>
              <p className="md:ml-6 mt-4 md:mt-0 md:w-1/2">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
