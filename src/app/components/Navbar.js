// components/Navbar.js
"use client";

import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter()
  const linkClasses = (path) =>
    router.pathname === path ? 'underline' : 'hover:underline'

  return (
    <nav className="bg-foreground p-4">
      <ul className="flex items-center space-x-6 text-beige">
        <li>
          <Link href="/">
            <img
              src="/images/vroc_logo.jpg"
              alt="VROC Logo"
              className="w-12 h-12 rounded-full"
            />
          </Link>
        </li>
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
    </nav>
  )
}
