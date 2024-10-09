"use client";
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('Message sent successfully!')
        setForm({ name: '', email: '', message: '' }) // Clear the form
      } else {
        setStatus('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setStatus('An error occurred. Please try again later.')
    }
  }

  return (
    <div>
      <main className="p-8">
        <h2 className="text-5xl font-semibold mb-8 text-beige">Contact Us</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto text-gray-900 bg-beige p-6 rounded shadow"
        >
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Message:</label>
            <textarea
              name="message"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Your message..."
              rows="5"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-orange font-semibold py-2 px-4 rounded transition-colors duration-300"
          >
            Send Message
          </button>
          {status && <p className="mt-4 text-center">{status}</p>}
        </form>
      </main>
    </div>
  )
}
