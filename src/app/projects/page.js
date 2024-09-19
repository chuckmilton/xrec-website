// app/projects/page.js
import Navbar from '../components/Navbar'

const projects = [
  {
    title: 'The Hub',
    description: 'In order to host multiple projects, The Hub is a central location that allows both VR and AR applications to exist together.',
    image: '',
    video: '../images/the_hub.png', // Add video URL if available
    },
  {
    title: 'AR Cooking Simulator',
    description: 'The AR Cooking Simulator is an augmented reality game designed to simulate a realistic cooking experience. Players can interact with virtual kitchen tools and ingredients in their real environment, following recipes step by step to create dishes. The game blends physical movement with digital instructions, providing an immersive and educational way to learn cooking techniques in a fun and engaging format.',
    image: '',
    video: '../videos/cooking_sim.mp4', // Add video URL if available
  },
  {
    title: 'Hole in the Wall',
    description: "The VR Hole in the Wall game is an immersive virtual reality experience where players must position their bodies to fit through moving walls with cut-out shapes. The game challenges users to think quickly and adjust their movements to match the required poses as the walls approach. It's a fun and interactive way to test reflexes and flexibility, all while engaging in an entertaining, fast-paced virtual environment.",
    image: '',
    video: '../videos/hit_demo.mp4', // Add video URL if available
  },
  {
    title: '5” Drone (In progress)',
    description: 'The project involves designing a 5" drone chassis from scratch with a focus on optimizing performance, durability, and flight efficiency. The design process begins with creating a CAD model of the chassis, incorporating precise dimensions for components such as brushless DC motors, ESCs (Electronic Speed Controllers), and propellers. Stress-strain and load tests will be conducted to ensure the chassis can handle flight stresses, vibrations, and impacts. Weight distribution and material strength will be considered for 3D printing the frame. The drone’s electronic systems will be powered by an STM32F4 microcontroller, serving as the flight controller. Embedded development will be done using STM32CubeIDE, with careful attention to wiring, motor control, and sensor integration. The project involves researching and selecting suitable components like high-efficiency brushless motors and propellers, ensuring compatibility and performance, to achieve a highly functional drone.',
    image: '../images/drone.png',
    video: '', // Add video URL if available
  },
  // Add more projects as needed
]

export default function Projects() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h2 className="text-3xl mb-6">Projects</h2>
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row mb-8 items-center"
          >
            {project.video ? (
              <video
                controls
                className="w-full md:w-1/2 rounded shadow"
                src={project.video}
              ></video>
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full md:w-1/2 h-64 object-cover rounded shadow"
              />
            )}
            <div className="md:ml-6 mt-4 md:mt-0">
              <h3 className="text-2xl">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
