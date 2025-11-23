import React from "react";
import { motion } from "framer-motion";
import SfcBackground from "../assets/sfcgBackgorund.jpg";
import {
  ClipboardList,
  Users,
  BarChart3,
  Mail,
  Facebook,
  Youtube,
  ArrowRightCircle,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../component/Home/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div 
      className="w-screen min-h-screen flex flex-col text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.80)), url(${SfcBackground})`,
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center flex-grow text-center px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-xl"
        >
          SFC-G Staff Task Management System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-base sm:text-lg max-w-2xl text-gray-200 mb-10"
        >
          Empowering staff and administrators with a seamless, transparent, and efficient way 
          to handle task assignments, performance tracking, and inter-department collaboration.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          {/*<GetStarted/>*/}
         
          <Link
            to="/about"
            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 backdrop-blur-sm"
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: <ClipboardList size={42} className="mx-auto mb-4 text-blue-400" />,
              title: "Smart Task Assignment",
              desc: "Easily create, assign, and track work orders in real-time for every department.",
            },
            {
              icon: <Users size={42} className="mx-auto mb-4 text-green-400" />,
              title: "Staff Collaboration",
              desc: "Connect staff across departments to enhance communication and accountability.",
            },
            {
              icon: <BarChart3 size={42} className="mx-auto mb-4 text-yellow-400" />,
              title: "Data-Driven Insights",
              desc: "Gain insights into staff performance and workload using interactive analytics.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="p-8 bg-white/10 rounded-2xl shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300 border border-white/10"
            >
              {feature.icon}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold mb-6 text-white"
        >
          About the System
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-300 text-base leading-relaxed mb-6"
        >
          Developed for <span className="font-semibold text-teal-400">Saint Francis College</span>, this platform 
          ensures that maintenance, administrative, and departmental tasks are handled efficiently, 
          from request submission to completion — saving time and improving transparency.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 text-teal-400">
            <CheckCircle2 size={18} /> Transparent Workflow
          </div>
          <div className="flex items-center gap-2 text-teal-400">
            <CheckCircle2 size={18} /> Real-Time Updates
          </div>
          <div className="flex items-center gap-2 text-teal-400">
            <CheckCircle2 size={18} /> Role-Based Access
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-lg py-8 px-6 border-t border-white/10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} SFC-G Task Management. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <a href="mailto:support@sfcg.edu.ph" className="hover:text-white transition flex items-center gap-2">
              <Mail size={16} /> Contact
            </a>
            <a href="#" className="hover:text-white transition flex items-center gap-2">
              <Facebook size={16} /> Facebook
            </a>
            <a href="#" className="hover:text-white transition flex items-center gap-2">
              <Youtube size={16} /> YouTube
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
