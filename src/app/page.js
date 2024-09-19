// app/page.js
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex items-center justify-center h-screen">
        <h1 className="text-5xl font-bold">XR Engineering Club</h1>
      </main>
    </div>
  )
}
