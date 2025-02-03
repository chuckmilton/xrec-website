"use client";

import { FaInstagram, FaEnvelope, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-beige py-4 px-4 mt-8">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <p className="text-sm">&copy; {currentYear} XR Engineering Club. All Rights Reserved.</p>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/vrcsulb?igsh=MzRlODBiNWFlZA=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          
          {/* Email */}
          <a href="mailto:vroc.csulb@gmail.com" className="hover:text-gray-400">
            <FaEnvelope className="w-6 h-6" />
          </a>
          
          {/* Discord */}
          <a
            href="https://discord.gg/NeQAnJeFNT"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaDiscord className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
