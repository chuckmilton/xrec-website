// app/projects/page.js
"use client";
import { useEffect, useState } from 'react';

const projects = [
  {
    title: 'The Hub',
    description: 'In order to host multiple projects, The Hub is a central location that allows both VR and AR applications to exist together.',
    image: '/images/the_hub.png',
    video: '', // Add video URL if available
    },
  {
    title: 'AR Cooking Simulator',
    description: 'The AR Cooking Simulator is an augmented reality game designed to simulate a realistic cooking experience. Players can interact with virtual kitchen tools and ingredients in their real environment, following recipes step by step to create dishes. The game blends physical movement with digital instructions, providing an immersive and educational way to learn cooking techniques in a fun and engaging format.',
    image: '',
    video: '/videos/cooking_sim.mp4', // Add video URL if available
  },
  {
    title: 'Hole in the Wall',
    description: "The VR Hole in The Wall game is an immersive virtual reality experience where players must position their bodies to fit through moving walls with cut-out shapes. The game challenges users to think quickly and adjust their movements to match the required poses as the walls approach. It's a fun and interactive way to test reflexes and flexibility, all while engaging in an entertaining, fast-paced virtual environment.",
    image: '',
    video: '/videos/hit_demo.mp4', // Add video URL if available
  },
  {
    title: '5” Drone (In progress)',
    description: 'The project involves designing a 5" drone chassis from scratch with a focus on optimizing performance, durability, and flight efficiency. The design process begins with creating a CAD model of the chassis, incorporating precise dimensions for components such as brushless DC motors, ESCs (Electronic Speed Controllers), and propellers. Stress-strain and load tests will be conducted to ensure the chassis can handle flight stresses, vibrations, and impacts. Weight distribution and material strength will be considered for 3D printing the frame. The drone’s electronic systems will be powered by an STM32F4 microcontroller, serving as the flight controller. Embedded development will be done using STM32CubeIDE, with careful attention to wiring, motor control, and sensor integration. The project involves researching and selecting suitable components like high-efficiency brushless motors and propellers, ensuring compatibility and performance, to achieve a highly functional drone.',
    image: '/images/drone.png',
    video: '', // Add video URL if available
  },
  // Add more projects as needed
]

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect when the component is mounted
    setIsVisible(true);
  }, []);

  return (
    <div>
      <main className="p-8">
        <h2 className="text-4xl font-semibold mb-6 text-beige">Projects</h2>
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`relative group flex flex-col md:flex-row justify-center items-center w-full bg-transparent p-0 md:p-0 overflow-hidden transition-all duration-700 ease-out
              transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
              style={{
                minHeight: '300px',
                transitionDelay: `${index * 0.3}s`, // Add staggered delay based on index
              }}
            >
              {/* Image/Video Container */}
              <div
                className="relative w-full md:w-1/2 transition-transform duration-500 group-hover:translate-x-0 md:group-hover:translate-x-[-50%]"
                style={{
                  height: '100%',
                  zIndex: 3,
                }}
              >
                {project.video ? (
                  <video
                    className="object-cover w-full h-full"
                    src={project.video}
                    muted
                    autoPlay
                    playsInline
                    loop
                    preload="metadata"
                    loading="lazy"
                  ></video>
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                )}

                {/* Arrow Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-4xl text-gray-700 opacity-100 group-hover:opacity-0 transition-opacity duration-500 md:block hidden">
                  <img
                    src="images/right-arrow.svg"
                    alt="Right arrow"
                    className="w-6 h-6" // Adjust size as necessary
                  />
                </div>
              </div>

              {/* Description Section */}
              <div
                className="text-gray-900 w-full md:w-1/2 h-full p-8 md:p-12 bg-beige transition-transform duration-500 opacity-100 md:opacity-0 group-hover:opacity-100 md:group-hover:translate-x-[50%] md:absolute overflow-y-auto flex flex-col items-center justify-start xl:justify-center"
                style={{
                  zIndex: 2,
                  maxHeight: '100%',
                  paddingTop: '2rem',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <h3 className="text-3xl font-semibold text-center">{project.title}</h3>
                <p className="mt-4 mx-4 text-center">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
