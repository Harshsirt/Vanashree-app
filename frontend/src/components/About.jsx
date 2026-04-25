import { motion } from "framer-motion"
import aboutimg from "../assets/about.jpg"

export default function About() {
  return (
    <div className="bg-white">

      
      <div className="relative h-[50vh] flex items-center justify-center text-center bg-green-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-5xl font-semibold mb-3">
            About Vanashree 🌱
          </h1>
          <p className="text-green-200 max-w-xl mx-auto">
            A platform built to empower people to plant, track and protect trees together.
          </p>
        </motion.div>
      </div>

      
      <div className="py-16 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">🌍 Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Vanashree aims to create a connected ecosystem where individuals,
            communities, and organizations collaborate to increase greenery.
            Every planted tree is tracked, monitored, and cared for.
          </p>
        </motion.div>

        <img
          src={aboutimg}
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* FEATURES */}
      <div className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">

        <h2 className="text-center text-2xl font-semibold mb-10">
          Why Vanashree?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">

          {[
            ["🌱", "Tree Tracking", "Each tree has identity & updates"],
            ["📍", "Location Based", "Know trees near you"],
            ["👥", "Community", "Work with volunteers"],
            ["📊", "Impact", "Track real environmental change"],
          ].map(([icon, title, desc]) => (
            <motion.div
              key={title}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-5 rounded-xl border text-center hover:shadow-xl transition"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </motion.div>
          ))}

        </div>
      </div>

     
      <div className="py-16 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600">
            Vanashree started as a small initiative to bring people together for
            tree plantation. Today, it’s growing into a digital ecosystem where
            every individual can contribute to a greener future.
          </p>
        </motion.div>

      </div>

      
      <div className="bg-green-900 text-white py-14 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          Join us in making the planet greener 🌍
        </h2>
        <button className="bg-green-400 text-green-900 px-6 py-2 rounded-lg">
          Start Planting
        </button>
      </div>

    </div>
  )
}