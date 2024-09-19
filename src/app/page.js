// app/page.js
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-5xl font-bold text-beige">
          XR Engineering Club
        </h1>
        <p className="mt-4 text-xl text-beige">
          Welcome to XREC's Official Website
        </p>
      </main>
    </div>
  )
}
