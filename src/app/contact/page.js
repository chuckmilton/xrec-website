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
        <h2 className="text-4xl font-semibold mb-6 text-beige">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-md text-gray-900 bg-beige p-6 rounded shadow">
          <div className="mb-4">
            <label className="block">Name:</label>
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
            <label className="block">Email:</label>
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
            <label className="block">Message:</label>
            <textarea
              name="message"
              className="w-full border p-2 rounded"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-orange p-2 rounded">
            Send Message
          </button>
          {status && <p className="mt-4">{status}</p>}
        </form>
      </main>
    </div>
  )
}
