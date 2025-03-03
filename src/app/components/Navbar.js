"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const pathname = usePathname();

  const linkClasses = (path) =>
    pathname === path ? 'underline' : 'hover:underline';

  useEffect(() => {
    async function checkAdminSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setAdminLoggedIn(!!session);
    }
    checkAdminSession();
  }, []);

  // Determine the admin button's text and link based on session status
  const adminButtonText = adminLoggedIn ? 'Go to Dashboard' : 'Admin Login';
  const adminButtonHref = adminLoggedIn ? '/admin/dashboard' : '/admin/login';

  return (
    <nav className="bg-foreground p-2">
      <div className="flex justify-between items-center font-semibold mx-2">
        {/* Logo */}
        <Link href="/">
          <div className="w-14 h-14 md:w-16 md:h-16 text-beige flex items-center space-x-2">
            <img
              src="/images/vroc_logo.png"
              alt="VROC Logo"
              className="rounded-full"
            />
            <h1 className="text-sm md:text-base whitespace-nowrap">XREC @ CSULB</h1>
          </div>
        </Link>

        {/* Hamburger menu button for mobile */}
        <div className="lg:hidden">
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
        <ul className="hidden lg:flex space-x-8 text-beige">
          <li>
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={linkClasses('/about')}>
              About Us
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
          {/* Distinct Admin button */}
          <li>
            <Link
              href={adminButtonHref}
              className="bg-purple-400 text-white px-3 py-2 rounded hover:bg-purple-500"
            >
              {adminButtonText}
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile menu with slide-down transition */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <ul className="mt-4 space-y-4 lg:hidden text-beige font-semibold pb-4">
          <li>
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={linkClasses('/about')}>
              About Us
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
          {/* Distinct Admin button */}
          <li>
            <Link
              href={adminButtonHref}
              className="bg-purple-400 text-white px-3 py-2 rounded hover:bg-purple-500"
            >
              {adminButtonText}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
