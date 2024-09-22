"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const linkClasses = (path) =>
    router.pathname === path ? 'underline' : 'hover:underline';

  return (
    <nav className="bg-foreground p-2">
      <div className="flex justify-between items-center font-semibold mx-2">
        {/* Logo */}
        <Link href="/">
        <div className='w-12 h-12 md:w-16 md:h-16 text-beige flex items-center space-x-2'>
        <img
            src="/images/vroc_logo.jpg"
            alt="VROC Logo"
            className="rounded-full"
          />
           <h1 className='text-xs md:text-sm whitespace-nowrap'>XREC @ CSULB</h1>
        </div>
          
        </Link>
       

        {/* Hamburger menu button for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-beige"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-8 6h8"
              />
            </svg>
          </button>
        </div>

        {/* Full menu for larger screens */}
        <ul className="hidden md:flex space-x-8 text-beige">
          <li>
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/officers" className={linkClasses('/officers')}>
              Officers
            </Link>
          </li>
          <li>
            <Link href="/projects" className={linkClasses('/projects')}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="/events" className={linkClasses('/events')}>
              Events
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClasses('/contact')}>
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile menu with slide-down transition */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="mt-4 space-y-4 md:hidden text-beige font-semibold">
          <li>
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/officers" className={linkClasses('/officers')}>
              Officers
            </Link>
          </li>
          <li>
            <Link href="/projects" className={linkClasses('/projects')}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="/events" className={linkClasses('/events')}>
              Events
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClasses('/contact')}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
