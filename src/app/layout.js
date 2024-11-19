import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react";


export const metadata = {
  title: 'XR Engineering Club - CSULB',
  description: 'Welcome to the XR Engineering Club website at CSULB, where we explore AR/VR and engineering innovation.',
  
  // Open Graph (OG) meta tags for social media sharing
  openGraph: {
    title: 'XR Engineering Club - CSULB',
    description: 'Join the XR Engineering Club at CSULB, where we dive into AR/VR and engineering.',
    url: 'https://www.xrengineering.club',
    type: 'website',
    images: [
      {
        url: '/images/vroc_logo.jpg',
        width: 800,
        height: 600,
        alt: 'XR Engineering Club Logo',
      },
    ],
  },

  // Canonical URL to avoid duplicate content issues
  alternates: {
    canonical: 'https://www.xrengineering.club',
  },

  // Keywords for SEO
  keywords: ['XR Engineering', 'CSULB', 'AR/VR', 'Engineering Club'],

  // Robots meta tag to control how search engines crawl and index the page
  robots: {
    index: true,
    follow: true,
  },

  // Language and region
  language: 'en-US',
  
  // Author meta tag
  authors: [{ name: 'XR Engineering Club', url: 'https://www.xrengineering.club' }],

  // Charset meta tag (important for encoding)
  charset: 'UTF-8',
};
export const generateViewport = () => 'width=device-width, initial-scale=1.0';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
