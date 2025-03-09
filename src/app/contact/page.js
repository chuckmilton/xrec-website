"use client";
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')
    setStatusType('pending')

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
        setStatusType('success')
        setForm({ name: '', email: '', message: '' }) // Clear the form
      } else {
        setStatus('Failed to send message')
        setStatusType('error')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setStatus('An error occurred. Please try again later.')
      setStatusType('error')
    }
  }

  // Status message styling based on status type
  const getStatusClass = () => {
    switch(statusType) {
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return '';
    }
  };

  return (
    <div>
      <main className="p-8">
        <h2 className="text-5xl font-semibold mb-8 text-beige">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full text-gray-900 bg-beige p-6 rounded-lg shadow-md"
          >
            <div className="mb-5">
              <label className="block mb-2 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-medium">Message:</label>
              <textarea
                name="message"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Your message..."
                rows="6"
              ></textarea>
            </div>
            <button
              type="submit"
              className="text-white w-full hover:bg-purple-500 font-semibold py-3 px-6 rounded-md transition-colors duration-300 bg-purple-400"
            >
              Send Message
            </button>
            {status && (
              <div className={`mt-5 p-3 border rounded-md text-center ${getStatusClass()}`}>
                {status}
              </div>
            )}
          </form>
          
          {/* Map Section */}
          <div className="w-full h-full">
            <div className="rounded-lg overflow-hidden shadow-md h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.0450492949844!2d-118.1140221!3d33.7771171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dd3129bdeb6643%3A0x2bdb37b3e143622f!2sInnovation%20Space!5e1!3m2!1sen!2sus!4v1740963628574!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}