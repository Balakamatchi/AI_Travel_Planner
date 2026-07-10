import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiCamera, FiSave } from "react-icons/fi";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import * as userService from "../services/userService";
import * as authService from "../services/authService";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userService.updateProfile(form);
      updateUser(data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const { data } = await userService.updateAvatar(formData);
      updateUser(data.user);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings</p>
      </div>

      <GlassCard className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative">
          <img
            src={
              user?.avatar?.url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "T")}&background=0aa8f0&color=fff&size=128`
            }
            alt="avatar"
            className="h-24 w-24 rounded-full border-4 border-primary-400 object-cover"
          />
          <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-md">
            <FiCamera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          {uploading && <p className="text-xs text-primary-500">Uploading avatar...</p>}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
          <FiUser /> Personal Information
        </h3>
        <form onSubmit={handleProfileUpdate} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              pattern="[A-Za-z ]+"
              title="Please enter a valid name"
              required
            />
          </div>
          <div>
            <label className="label-text">Email</label>
            <input className="input-field opacity-60" value={user?.email} disabled />
          </div>
          <div>
            <label className="label-text">Phone</label>
              <input
                type="tel"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit phone number"
                required
              />
          </div>
          <div>
            <label className="label-text">Country</label>
              <input
                type="text"
                className="input-field"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                pattern="[A-Za-z ]+"
                title="Please enter a valid country name"
                required
              />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary">
              <FiSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
          <FiLock /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Current Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;
