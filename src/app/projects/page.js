"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabaseClient";

const ProjectCard = ({ project, index, isVisible }) => (
  <div
    tabIndex={0} // Make this element focusable
    className={`rounded relative group flex flex-col md:flex-row justify-center items-center w-full max-w-md md:max-w-full mx-auto bg-transparent overflow-hidden transition-all duration-700 ease-out cursor-pointer transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
    }`}
    // Remove the fixed minHeight on mobile; use padding/margins to control spacing
    style={{
      transitionDelay: `${index * 0.3}s`, // Staggered delay for fade-in effect
    }}
  >
    {/* Image/Video Container */}
    <div
      className="relative w-full md:w-1/2 aspect-video md:aspect-auto transition-transform duration-500 group-focus:translate-x-0 md:group-focus:translate-x-[-50%]"
      style={{
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
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={500} // Adjust based on the original image’s aspect ratio
          className="object-cover w-full h-full"
          loading="lazy"
        />
      )}

      {/* Title Overlay - Visible only on large screens */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 group-focus:bg-opacity-0">
        <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold transition-opacity duration-500 group-focus:opacity-0">
          {project.title}
        </h3>
      </div>
    </div>

    {/* Description Section */}
    <div
      className="text-gray-900 w-full md:w-1/2 p-2 md: p-8 bg-beige transition-transform duration-500 opacity-100 md:opacity-0 group-focus:opacity-100 md:group-focus:translate-x-[50%] md:absolute overflow-y-auto flex flex-col items-center justify-start xl:justify-center"
      style={{
        zIndex: 2,
        height: "100%",
        paddingTop: "2rem",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <h3 className="text-3xl font-semibold text-center">{project.title}</h3>
      <p className="mt-4 mx-4 text-center">{project.description}</p>
    </div>
  </div>
);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Trigger the animation after projects have been loaded.
  useEffect(() => {
    if (projects.length > 0) {
      setIsVisible(true);
    }
  }, [projects]);

  if (loading) {
    return <div className="p-8">Loading projects...</div>;
  }

  // Optionally, filter projects by category.
  const softwareProjects = projects.filter(
    (project) => project.category === "software"
  );
  const hardwareProjects = projects.filter(
    (project) => project.category === "hardware"
  );

  return (
    <div>
      <main className="p-8">
        <h2 className="text-5xl font-semibold mb-8 text-beige">Projects</h2>

        {/* Software Projects Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-semibold mb-4 text-beige">
            Software Projects
          </h3>
          <div className="grid grid-cols-1 gap-8">
            {softwareProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </section>

        {/* Hardware Projects Section */}
        <section>
          <h3 className="text-3xl font-semibold mb-4 text-beige">
            Hardware Projects
          </h3>
          <div className="grid grid-cols-1 gap-8">
            {hardwareProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
