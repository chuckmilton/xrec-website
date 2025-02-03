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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="mb-4 text-2xl font-bold">Admin Login</h2>
        {errorMsg && <p className="mb-4 text-red-500">{errorMsg}</p>}
        <label className="block mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block mb-4">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <button type="submit" className="w-full p-2 font-bold text-white bg-beige rounded">
          Login
        </button>
      </form>
    </div>
  );
}
