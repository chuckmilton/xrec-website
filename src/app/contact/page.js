// app/contact/page.js
import Navbar from '../components/Navbar'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic (e.g., send to an API)
    alert('Message sent!')
  }

  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h2 className="text-3xl mb-6">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label className="block">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border p-2 rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Message</label>
            <textarea
              name="message"
              className="w-full border p-2 rounded"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded"
          >
            Send Message
          </button>
        </form>
      </main>
    </div>
  )
}
