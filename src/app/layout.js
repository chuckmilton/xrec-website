// app/layout.js
import './globals.css'

export const metadata = {
  title: 'XR Engineering Club',
  description: 'Welcome to the XR Engineering Club website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
