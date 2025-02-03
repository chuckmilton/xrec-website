"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setSession(session);
      }
    }
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (!session) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin/login");
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <p className="text-xl text-gray-700">Welcome, <span className="font-semibold">{session.user.email}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Update Profile Card */}
          <a
            href="/admin/profile"
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 text-blue-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.847.644 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Update My Profile</h2>
            </div>
            <p className="text-gray-600">
              View and update your personal details and profile picture.
            </p>
          </a>

          {/* Manage Events Card */}
          <a
            href="/admin/events"
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Manage Events</h2>
            </div>
            <p className="text-gray-600">
              Create, update, and delete events from the calendar.
            </p>
          </a>

          {/* Manage Projects Card */}
          <a
            href="/admin/projects"
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 text-purple-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 16h3.75M9 8h3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Manage Projects</h2>
            </div>
            <p className="text-gray-600">
              Oversee and update ongoing projects and initiatives.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
