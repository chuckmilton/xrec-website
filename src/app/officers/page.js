"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaEnvelope, FaLinkedin } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";

export default function Officers() {
  const [officers, setOfficers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices on mount.
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  // Fetch officer data.
  useEffect(() => {
    async function fetchOfficers() {
      const { data, error } = await supabase
        .from("officers")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        console.error("Error fetching officers:", error);
      } else {
        setOfficers(data);
      }
    }
    fetchOfficers();
  }, []);

  // Set cards visible immediately on mobile to avoid animation delays.
  useEffect(() => {
    if (officers.length > 0 || isMobile) {
      setIsVisible(true);
    }
  }, [officers, isMobile]);

  return (
    <div>
      <main className="p-8">
        <h2 className="text-5xl font-semibold mb-8 text-beige">Officers</h2>
        <div className="max-w-5xl mx-6 sm:mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {officers.map((officer, index) => {
              // For mobile, bypass the transition animation.
              const cardClasses = isMobile
                ? "bg-beige p-6 rounded shadow overflow-hidden transform opacity-100 translate-x-0"
                : `bg-beige p-6 rounded shadow overflow-hidden transform transition-all duration-700 ease-out ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[-100%]"
                  }`;

              return (
                <div
                  key={index}
                  className={cardClasses}
                  style={{
                    transitionDelay: isMobile ? "0s" : `${index * 0.2}s`,
                    willChange: "transform, opacity"
                  }}
                >
                  <Image
                    src={officer.image}
                    alt={officer.name}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover rounded"
                    loading="lazy"
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
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
