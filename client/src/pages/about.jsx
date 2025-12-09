import React from "react";
import { motion } from "framer-motion";
import { Users, ClipboardCheck, BarChart3, Target } from "lucide-react";
import Navbar from "../component/Home/Navbar";
import SfcBackground from "../assets/sfcgBackgorund.jpg";


const About = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.80)), url(${SfcBackground})`,
          }}>
      <Navbar />

      {/* Header Section */}
      <header className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-lg"
        >
          About the SFC-G Staff Task Management System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="max-w-3xl mx-auto text-gray-300 text-sm sm:text-base"
        >
          A digital platform built to improve efficiency, transparency, and communication 
          within <span className="font-semibold text-teal-400">Saint Francis College Guihulngan</span>. 
          This system empowers staff and administrators to manage, monitor, and accomplish 
          work tasks seamlessly.
        </motion.p>
      </header>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-teal-400">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Our mission is to provide an organized and efficient way for staff to request, 
            track, and complete tasks while allowing administrators to monitor progress 
            in real time. By reducing manual paperwork and miscommunication, we help 
            improve productivity and accountability across departments.
          </p>
          <p className="text-gray-300 leading-relaxed">
            This initiative reflects the college’s commitment to modernization, 
            digital transformation, and operational excellence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col gap-4"
        >
          {[
            { icon: Users, text: "Encourages collaboration between departments" },
            { icon: ClipboardCheck, text: "Streamlines task assignment and completion tracking" },
            { icon: BarChart3, text: "Provides analytics for better decision-making" },
            { icon: Target, text: "Improves accountability and transparency" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 border border-white/10"
            >
              <item.icon className="text-teal-400 w-6 h-6" />
              <span className="text-gray-200 text-sm sm:text-base">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Developer Section */}
      <section className="bg-black/40 backdrop-blur-md py-14 px-6 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-teal-400">System Developers</h2>
          <p className="text-gray-300 text-sm sm:text-base mb-6">
            This system was developed by the BSIS students of Saint Francis College Guihulngan
            as part of their capstone project — designed to serve the needs of the school community.
          </p>

          
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-6 text-center border-t border-white/10 text-gray-400 text-sm">
        © {new Date().getFullYear()} Saint Francis College Guihulngan — Task Management System.
      </footer>
    </div>
  );
};

export default About;
