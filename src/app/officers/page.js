// app/officers/page.js
import Navbar from '../components/Navbar'

import { FaEnvelope, FaLinkedin } from 'react-icons/fa'

const officers = [
  {
    name: 'Diego Davalos',
    role: 'President, Hardware Lead',
    email: 'diegodavalos234@gmail.com',
    image: '/images/diego.png',
    linkedin: 'https://www.linkedin.com/in/diego-davalos-5aa2b2234/'
  },
  {
    name: 'Anton Katona',
    role: 'Vice President, Software Lead',
    email: 'antonjkatona@gmail.com',
    image: '/images/anton.jpeg',
    linkedin: 'https://www.linkedin.com/in/antonkatona/'
  },
  {
    name: 'Russell Harral',
    role: 'Hole in the Wall Lead',
    email: 'russellharral4@gmail.com',
    image: '/images/russell.jpg',
    linkedin: 'https://www.linkedin.com/in/russell-harral-75a30720b/'
  },
  {
    name: 'Yunis Nabiyev',
    role: 'Project Manager',
    email: 'yunisnabiyev@gmail.com',
    image: '/images/yunis.jpg',
    linkedin: 'https://www.linkedin.com/in/yunisn/'
  },
  {
    name: 'Charles Milton',
    role: 'Webmaster',
    email: 'chuckmilton123@gmail.com',
    image: '/images/charles.jpeg',
    linkedin: 'https://www.linkedin.com/in/charles-milton-0b679427b/'
  },
  // Add more officers as needed
]

export default function Officers() {
    return (
      <div>
        <Navbar />
        <main className="p-8">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Officers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officers.map((officer, index) => (
              <div key={index} className="bg-beige p-6 rounded shadow overflow-hidden transform transition-transform duration-200 hover:scale-105">
                <img
                  src={officer.image}
                  alt={officer.name}
                  className="w-full h-64 object-cover rounded"
                />
                <h3 className="text-xl mt-4 text-gray-900 font-semibold">
                  {officer.name}
                </h3>
                <p className="text-gray-700">{officer.role}</p>
                <div className="flex items-center mt-4 space-x-4">
                  <a
                    href={`mailto:${officer.email}`}
                    className="text-gray-700 hover:text-gray-900 flex items-center"
                  >
                    <FaEnvelope className="w-5 h-5 mr-2" />
                    <span>Email</span>
                  </a>
                  {officer.linkedin && (
                    <a
                      href={officer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900 flex items-center"
                    >
                      <FaLinkedin className="w-5 h-5 mr-2" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }
  
