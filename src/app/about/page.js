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
  const images = [
    { src: '/images/group.jpeg', alt: 'XREC Group Photo' },
    { src: '/images/gbm2.png', alt: 'General Body Meeting Photo' },
    { src: '/images/wow.png', alt: 'Week of Welcome Photo' },
    { src: '/images/gbm.png', alt: 'General Body Meeting Photo' },
    { src: '/images/ispacebg.jpg', alt: 'iSpace Photo' },
    { src: '/images/presentation.png', alt: 'Presentation Photo' },
    { src: '/images/drone_diego4.jpg', alt: 'Diego working on Drone Photo' },
    { src: '/images/drone_group.jpg', alt: 'Drone Workshop Photo' },
    { src: '/images/drone_group2.jpg', alt: 'Drone Workshop Photo' },
    { src: '/images/drone_group3.jpg', alt: 'Drone Workshop Photo' },
    { src: '/images/droneimg.jpg', alt: 'Drone Photo' },
  ];

  return (
    <div>
      <main className="p-8 text-beige">
        <h1 className="text-5xl font-semibold mb-8 text-beige">About Us</h1>
        <div className="p-6 rounded max-w-100">
          
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
            <p className="text-lg text-beige mb-4">
              The XR Engineering Club (XREC) is a student-led organization at California State University, Long Beach (CSULB) dedicated to exploring and creating cutting-edge XR (Extended Reality) projects. Our club is a hands-on environment for students interested in both the software and hardware aspects of immersive technologies.
            </p>
            <p className="text-lg text-beige">
              Formerly known as the Virtual Reality Operations Club (VROC), XREC has evolved to encompass a broader range of immersive experiences, while still maintaining our roots in VR. Our mission is to bring together individuals passionate about pushing the boundaries of what&apos;s possible in XR development.
            </p>
          </motion.section>

          {/* Group Photo Section */}
          <motion.section
            className="mb-10 overflow-hidden w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <div className="relative flex w-full overflow-hidden">
              <motion.div
                className="flex gap-4"
                initial={{ x: 0 }}
                animate={{ x: '-150%' }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {/* Duplicate the image set to create a seamless loop */}
                {[...images, ...images].map((image, index) => (
                  <Image
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    width={300}
                    height={200}
                    className="rounded shadow-md object-cover"
                  />
                ))}
              </motion.div>
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
            <p className="text-lg text-beige mb-4">
              XREC aims to be the premier hub for XR innovation at CSULB. Our mission is to equip students with the technical knowledge and skills necessary to excel in the fast-growing field of immersive technology. We provide opportunities for students to collaborate on projects that integrate both software and hardware solutions.
            </p>
            <p className="text-lg text-beige">
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
            <ul className="list-disc ml-5 text-lg text-beige">
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
            <p className="text-lg text-beige mb-4">
              Whether you&apos;re interested in coding, designing, or working on the hardware side, XREC is open to all students passionate about XR technologies. Come be a part of the future of immersive technology!
            </p>
            <p className="text-lg text-beige">
              For more information, feel free to attend a meeting or reach out to us at <a href="mailto:vroc.csulb@gmail.com" className="text-pink-400 font-semibold">vroc.csulb@gmail.com</a>.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
