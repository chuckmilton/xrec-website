"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

// Helper: Extract the file name from a public URL.
// This function assumes the URL format is:
// https://<project_id>.supabase.co/storage/v1/object/public/{bucketName}/{fileName}
const getFileNameFromUrl = (url, bucketName) => {
  if (!url) return null;
  const parts = url.split(`/public/${bucketName}/`);
  if (parts.length < 2) return null;
  return parts[1];
};

// Helper: Delete a file from a specified bucket.
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

// Helper: Fix URL if necessary (ensure it starts with "https://")
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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    video: "",
    category: "",
  });
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Protect the route: redirect if not logged in.
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image upload handler for project image.
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;
    // Upload image to "project-images" bucket.
    const { error } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, { upsert: true, contentType: file.type });
    if (error) {
      console.error("Error uploading image:", error.message);
      setUploadingImage(false);
      return;
    }
    const { data, error: publicUrlError } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);
    if (publicUrlError) {
      console.error("Error getting public URL for image:", publicUrlError.message);
    } else if (data && data.publicUrl) {
      const fixedUrl = fixUrl(data.publicUrl);
      // If a video already exists, delete it since only one media type is allowed.
      if (form.video) {
        await deleteFileFromStorage("project-videos", form.video);
        setForm((prev) => ({ ...prev, video: "" }));
      }
      setForm((prev) => ({ ...prev, image: fixedUrl }));
    }
    setUploadingImage(false);
  };

  // Video upload handler for project video.
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingVideo(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;
    // Upload video to "project-videos" bucket.
    const { error } = await supabase.storage
      .from("project-videos")
      .upload(filePath, file, { upsert: true, contentType: file.type });
    if (error) {
      console.error("Error uploading video:", error.message);
      setUploadingVideo(false);
      return;
    }
    const { data, error: publicUrlError } = supabase.storage
      .from("project-videos")
      .getPublicUrl(filePath);
    if (publicUrlError) {
      console.error("Error getting public URL for video:", publicUrlError.message);
    } else if (data && data.publicUrl) {
      const fixedUrl = fixUrl(data.publicUrl);
      // If an image already exists, delete it since only one media type is allowed.
      if (form.image) {
        await deleteFileFromStorage("project-images", form.image);
        setForm((prev) => ({ ...prev, image: "" }));
      }
      setForm((prev) => ({ ...prev, video: fixedUrl }));
    }
    setUploadingVideo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce: only one media type allowed per project.
    if (form.image && form.video) {
      console.error("Please upload either an image or a video, not both.");
      return;
    }

    if (editingProject) {
      // If updating and the new image/video differs from the old one, delete the old file.
      if (editingProject.image && editingProject.image !== form.image) {
        await deleteFileFromStorage("project-images", editingProject.image);
      }
      if (editingProject.video && editingProject.video !== form.video) {
        await deleteFileFromStorage("project-videos", editingProject.video);
      }
      const { error } = await supabase
        .from("projects")
        .update(form)
        .eq("id", editingProject.id);
      if (error) {
        console.error("Error updating project:", error);
      }
    } else {
      const { error } = await supabase.from("projects").insert(form);
      if (error) {
        console.error("Error inserting project:", error);
      }
    }
    setForm({ title: "", description: "", image: "", video: "", category: "" });
    setEditingProject(null);
    fetchProjects();
  };

  const handleEdit = (project) => {
    setForm(project);
    setEditingProject(project);
  };

  const handleDelete = async (id) => {
    // Find the project to delete.
    const projectToDelete = projects.find((p) => p.id === id);
    if (projectToDelete) {
      if (projectToDelete.image) {
        await deleteFileFromStorage("project-images", projectToDelete.image);
      }
      if (projectToDelete.video) {
        await deleteFileFromStorage("project-videos", projectToDelete.video);
      }
    }
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting project:", error);
    }
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Project Form Card */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProject ? "Update Project" : "Add New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Project Title:</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Project Title"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Project Description:</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Project Description"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Media Upload: Only one allowed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Project Image:</label>
                {form.image && (
                  <div className="mb-2">
                    <img
                      src={form.image}
                      alt="Project"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
                {uploadingImage && (
                  <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Project Video:</label>
                {form.video && (
                  <div className="mb-2">
                    <video
                      src={form.video}
                      controls
                      className="w-32 h-32 object-cover rounded"
                    ></video>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="w-full p-2 border rounded"
                />
                {uploadingVideo && (
                  <p className="text-sm text-gray-500 mt-1">Uploading video...</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Project Category:</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
              {editingProject ? "Update Project" : "Add Project"}
            </button>
          </form>
        </div>

        {/* Projects List Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-600">No projects found.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="border-b last:border-0 py-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-gray-700">{project.description}</p>
                <p className="text-gray-600 mt-1">
                  <strong>Category:</strong> {project.category}
                </p>
                {project.image && (
                  <div className="mt-2">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                {project.video && (
                  <div className="mt-2">
                    <video
                      src={project.video}
                      controls
                      className="w-32 h-32 object-cover rounded"
                    ></video>
                  </div>
                )}
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
