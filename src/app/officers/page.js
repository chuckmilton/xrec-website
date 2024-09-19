// app/officers/page.js
import Navbar from '../components/Navbar'

const officers = [
  {
    name: 'Diego Davalos',
    role: 'President, Hardware Lead',
    email: 'diegodavalos234@gmail.com',
    image: './images/diego.png', // Ensure the image exists in the public/images folder
  },
  {
    name: 'Anton Katona',
    role: 'Vice President, Sotware Lead',
    email: 'antonjkatona@gmail.com',
    image: './images/anton.jpeg', // Ensure the image exists in the public/images folder
  },
  {
    name: 'Russell Harral',
    role: 'Hole in the Wall Lead',
    email: 'russellharral4@gmail.com',
    image: './images/russell.jpg', // Ensure the image exists in the public/images folder
  },
  {
    name: 'Yunis Nabiyev',
    role: 'Project Manager',
    email: 'yunisnabiyev@gmail.com',
    image: './images/yunis.jpg', // Ensure the image exists in the public/images folder
  },
  {
    name: 'Charles Milton',
    role: 'Webmaster',
    email: 'chuckmilton123@gmail.com',
    image: './images/charles.jpeg', // Ensure the image exists in the public/images folder
  },
  // Add more officers as needed
]

export default function Officers() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h2 className="text-3xl mb-6">Officers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officers.map((officer, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded shadow">
              <img
                src={officer.image}
                alt={officer.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl mt-4">{officer.name}</h3>
              <p>{officer.role}</p>
              <a href={`mailto:${officer.email}`} className="text-blue-500">
                {officer.email}
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
