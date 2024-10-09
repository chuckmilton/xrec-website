// app/about/page.js
'use client';

import Image from 'next/image'; // If using Next.js Image component
import { motion } from 'framer-motion'; // Import Framer Motion

export default function AboutUs() {
  // Variants for the scroll animation
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <main className="p-8 text-gray-900">
        <h1 className="text-5xl font-semibold mb-8 text-beige">About Us</h1>
        <div className="bg-beige p-6 rounded max-w-100">
          
          {/* Who We Are Section */}
          <motion.section 
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
            <p className="text-lg text-gray-800 mb-4">
              The XR Engineering Club (XREC) is a student-led organization at California State University, Long Beach (CSULB) dedicated to exploring and creating cutting-edge XR (Extended Reality) projects. Our club is a hands-on environment for students interested in both the software and hardware aspects of immersive technologies.
            </p>
            <p className="text-lg text-gray-800">
              Formerly known as the Virtual Reality Operations Club (VROC), XREC has evolved to encompass a broader range of immersive experiences, while still maintaining our roots in VR. Our mission is to bring together individuals passionate about pushing the boundaries of what's possible in XR development.
            </p>
          </motion.section>

          {/* Group Photo Section */}
          <motion.section 
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-semibold mb-4">Meet the Team</h2>
            <div className="w-full flex justify-center mb-8">
              <Image 
                src="/images/group.jpeg"
                alt="XREC Group Photo"
                width={800}
                height={500}
                className="rounded shadow-lg"
              />
            </div>
          </motion.section>

          {/* Our Mission Section */}
          <motion.section 
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-800 mb-4">
              XREC aims to be the premier hub for XR innovation at CSULB. Our mission is to equip students with the technical knowledge and skills necessary to excel in the fast-growing field of immersive technology. We provide opportunities for students to collaborate on projects that integrate both software and hardware solutions.
            </p>
            <p className="text-lg text-gray-800">
              By fostering a culture of learning and experimentation, we strive to create experiences that are not only visually stunning but also groundbreaking in their use of XR technologies.
            </p>
          </motion.section>

          {/* What We Do Section */}
          <motion.section 
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-semibold mb-4">What We Do</h2>
            <ul className="list-disc ml-5 text-lg text-gray-800">
              <li className="mb-2">Design and develop XR applications using tools like Unity.</li>
              <li className="mb-2">Work with a wide array of XR hardware.</li>
              <li className="mb-2">Host workshops to encourage creative solutions in XR technologies.</li>
              <li className="mb-2">Collaborate on both software and hardware projects, bridging the gap between virtual experiences and physical devices.</li>
              <li className="mb-2">Network with industry professionals and alumni to gain insight into the future of XR and related technologies.</li>
            </ul>
          </motion.section>

          {/* Join Us Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-semibold mb-4">Join Us</h2>
            <p className="text-lg text-gray-800 mb-4">
              Whether you're interested in coding, designing, or working on the hardware side, XREC is open to all students passionate about XR technologies. Come be a part of the future of immersive technology!
            </p>
            <p className="text-lg text-gray-800">
              For more information, feel free to attend a meeting or reach out to us at <a href="mailto:vroc.csulb@gmail.com" className="text-purple-700">vroc.csulb@gmail.com</a>.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
