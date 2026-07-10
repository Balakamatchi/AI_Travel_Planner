import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCpu,
  FiMap,
  FiCompass,
  FiBookOpen,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/ai-planner", label: "AI Trip Planner", icon: <FiCpu /> },
  { to: "/trips", label: "My Trips", icon: <FiCompass /> },
  { to: "/budget", label: "Budget Tracker", icon: <FaRupeeSign /> },
  { to: "/map", label: "Interactive Map", icon: <FiMap /> },
  { to: "/journal", label: "Travel Journal", icon: <FiBookOpen /> },
  { to: "/profile", label: "Profile", icon: <FiUser /> },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-50 flex h-full w-64 flex-col border-r border-white/30 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient text-white">
              <MdFlightTakeoff size={18} />
            </div>
            <span className="font-display text-lg font-bold text-slate-800 dark:text-white">
              TravelAI
            </span>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} AI Travel Planner
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
