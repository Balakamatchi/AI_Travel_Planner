import React from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/30 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-4 py-3 lg:px-8">
      <button
        className="rounded-lg p-2 text-slate-600 dark:text-slate-200 lg:hidden"
        onClick={onMenuClick}
      >
        <FiMenu size={22} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back,
        </p>
        <p className="font-semibold text-slate-800 dark:text-white">
          {user?.name || "Traveler"} ✈️
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <img
          src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "T")}&background=0aa8f0&color=fff`}
          alt="avatar"
          className="h-10 w-10 rounded-full object-cover border-2 border-primary-400"
        />
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
