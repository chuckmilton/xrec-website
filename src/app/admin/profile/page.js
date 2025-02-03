"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    image: "", // This will store the public URL of the uploaded image
    linkedin: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  // Helper: Fix URL if necessary.
  const fixUrl = (url) => {
    let fixedUrl = url;
    if (fixedUrl.startsWith("https:/") && !fixedUrl.startsWith("https://")) {
      fixedUrl = fixedUrl.replace("https:/", "https://");
    }
    if (fixedUrl.startsWith("http://www.xrengineering.club/")) {
      fixedUrl = fixedUrl.replace("https://www.xrengineering.club/", "");
    }
    return fixedUrl;
  };

  // Helper: Extract file name from public URL.
  // Expected URL: https://<project_id>.supabase.co/storage/v1/object/public/officer-images/<fileName>
  const getFileNameFromUrl = (url, bucketName = "officer-images") => {
    if (!url) return null;
    const parts = url.split(`/public/${bucketName}/`);
    if (parts.length < 2) return null;
    return parts[1];
  };

  // Helper: Delete a file from the specified bucket.
  const deleteFileFromStorage = async (bucket, url) => {
    const fileName = getFileNameFromUrl(url, bucket);
    if (!fileName) return;
    const { error } = await supabase.storage.from(bucket).remove([fileName]);
    if (error) {
      console.error(`Error deleting file from ${bucket}:`, error.message);
    } else {
      console.log(`Deleted file ${fileName} from bucket ${bucket}.`);
    }
  };

  // Check for an authenticated user and fetch the profile.
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
      } else {
        fetchProfile(session.user);
      }
    }
    checkUser();
  }, []);

  const fetchProfile = async (user) => {
    const { data, error } = await supabase
      .from("officers")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();
    if (error) {
      console.error("Error fetching profile:", error);
    } else if (!data) {
      console.warn("No profile found for user:", user.email);
      // Optionally initialize a new profile here.
    } else {
      setProfile(data);
      setForm(data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file selection and upload to Supabase Storage.
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    // If there is an existing image in the form, delete it.
    if (form.image) {
      await deleteFileFromStorage("officer-images", form.image);
    }

    // Create a unique file name.
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName; // Optionally add a folder prefix

    // Upload the file to the "officer-images" bucket.
    const { error } = await supabase.storage
      .from("officer-images")
      .upload(filePath, file, { upsert: true, contentType: file.type });
    if (error) {
      console.error("Error uploading file:", error.message);
      setUploading(false);
      return;
    }

    // Retrieve the public URL.
    const { data, error: publicUrlError } = supabase.storage
      .from("officer-images")
      .getPublicUrl(filePath);
    if (publicUrlError) {
      console.error("Error getting public URL:", publicUrlError.message);
    } else if (data && data.publicUrl) {
      const fixedUrl = fixUrl(data.publicUrl);
      setForm((prev) => ({ ...prev, image: fixedUrl }));
    }
    setUploading(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("officers")
      .update(form)
      .eq("email", form.email);
    if (error) {
      console.error("Error updating profile:", error);
    } else {
      alert("Profile updated successfully!");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        fetchProfile(session.user);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg("Password updated successfully!");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  if (!profile) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Role:</label>
              <input
                type="text"
                name="role"
                value={form.role || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Profile Image:</label>
              {form.image && (
                <div className="mb-2">
                  <img
                    src={form.image}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded"
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>
            <div>
              <label className="block text-gray-700">LinkedIn URL:</label>
              <input
                type="text"
                name="linkedin"
                value={form.linkedin || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
              Save Profile
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm New Password:</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded">
              Update Password
            </button>
            {passwordMsg && <p className="mt-2 text-sm text-red-500">{passwordMsg}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
