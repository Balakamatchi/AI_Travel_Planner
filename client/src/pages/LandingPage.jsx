import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdFlightTakeoff } from "react-icons/md";
import {
  FiCpu,
  FiMap,
  FiBookOpen,
  FiArrowRight,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  {
    icon: <FiCpu />,
    title: "AI Trip Planner",
    desc: "Get a full itinerary, food picks, and packing list generated instantly by AI.",
  },
  {
    icon: <FaRupeeSign />,
    title: "Budget & Expenses",
    desc: "Track spending by category and visualize budget vs. actual in real time.",
  },
  {
    icon: <FiMap />,
    title: "Interactive Maps",
    desc: "Explore attractions, hotels, and restaurants pinned right on the map.",
  },
  {
    icon: <FiBookOpen />,
    title: "Travel Journal",
    desc: "Capture memories with notes, photos, and ratings for every trip.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <header className="page-container flex items-center justify-between py-6">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient text-white"><MdFlightTakeoff size={18} /></div>
          TravelAI
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="btn-secondary text-sm">
            Log In
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </header>

      <section className="page-container grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary-100 dark:bg-primary-500/20 px-4 py-1.5 text-sm font-semibold text-primary-600 dark:text-primary-300">
            Powered by AI ✨
          </span>
          <h1 className="text-4xl font-bold leading-tight text-slate-800 dark:text-white sm:text-5xl">
            Plan your next trip in{" "}
            <span className="bg-hero-gradient bg-clip-text text-transparent">
              seconds, not hours
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 dark:text-slate-400">
            Tell us your destination, budget, and days. Our AI builds a complete
            itinerary, budget breakdown, and packing checklist — so you can focus
            on the adventure.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary text-base">
              Plan My Trip <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary text-base">
              I already have an account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card animate-float p-6">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80"
              alt="Travel planning"
              className="h-72 w-full rounded-xl object-cover"
            />
          </div>
        </motion.div>
      </section>

      <section className="page-container py-16">
        <h2 className="section-title text-center">Everything you need to travel smarter</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 text-2xl text-primary-500">
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="page-container pb-20">
        <div className="glass-card flex flex-col items-center gap-4 bg-hero-gradient p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to plan your dream trip?</h2>
          <p className="max-w-md text-white/90">
            Join AI Travel Planner today and let AI do the heavy lifting.
          </p>
          <Link
            to="/register"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg transition hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="page-container border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} AI Travel Planner. Built with the MERN stack.
      </footer>
    </div>
  );
};

export default LandingPage;
