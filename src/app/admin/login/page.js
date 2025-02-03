"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Check for an existing session and redirect if already logged in.
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "/admin/dashboard";
      }
    }
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Supabase v2: Use signInWithPassword
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
