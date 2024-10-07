import Image from 'next/image'

const events = [
  {
    date: 'Oct. 7, 2024',
    time: '5:30-6:30 PM',
    title: 'General Body Meeting',
    description: "Join us for XREC's first General Body Meeting and dive into the world of immersive tech! Discover exciting projects, hands-on opportunities, and how you can be part of the future of XR—don’t miss it! 🚀",
    location: 'University Library - Lower Level Room 005',
    image: '/images/ispacebg.jpg', // Ensure this image exists in your public/images directory
  },
  // Add more events as needed
]

export default function Events() {
  return (
    <div>
      <main className="p-8 text-gray-900">
        <h2 className="text-4xl font-semibold mb-6 text-beige">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-beige rounded shadow"
            >
              <Image
                src={event.image}
                alt={event.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-700 mb-2">{event.description}</p>
                <p className="text-gray-600">
                  Date: {event.date}
                </p>
                <p className="text-gray-600">
                  Time: {event.time} 
                </p>
                <p className="text-gray-600">
                  Location: {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
