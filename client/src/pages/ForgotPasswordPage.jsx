import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiSend } from "react-icons/fi";
import * as authService from "../services/authService";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    accountName: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      await authService.resetPasswordWithoutEmail(form);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        navigate("/login");}, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Verify your account to create a new password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="label-text">Account Identifier</label>
            <input
              type="text"
              required
              value={form.accountName}
              onChange={(e) =>
                setForm({ ...form, accountName: e.target.value })
              }
              className="input-field"
              placeholder="Enter your account name"
            />
          </div>

          <div>
            <label className="label-text">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="input-field"
              placeholder="New password"
            />
          </div>

          <div>
            <label className="label-text">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="input-field"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            <FiSend />
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>



        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-primary-500 hover:underline">
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
