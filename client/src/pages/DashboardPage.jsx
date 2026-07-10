import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCompass,
  FiTrendingUp,
  FiGlobe,
  FiPlus,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import StatCard from "../components/StatCard";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import TripCard from "../components/TripCard";
import * as userService from "../services/userService";

const COLORS = ["#0aa8f0", "#14b8a6", "#ff7a45", "#a855f7", "#f43f5e"];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await userService.getDashboardStats();
        setStats(data.stats);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader label="Loading your dashboard..." />;

  const categoryData = Object.entries(stats?.expensesByCategory || {}).map(
    ([name, value]) => ({ name, value })
  );
  const monthData = Object.entries(stats?.tripsByMonth || {}).map(
    ([name, value]) => ({ name, trips: value })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your travel overview at a glance
          </p>
        </div>
        <Link to="/ai-planner" className="btn-primary">
          <FiPlus /> Plan New Trip
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FiCompass />}
          label="Upcoming Trips"
          value={stats?.upcomingTrips ?? 0}
          color="primary"
        />
        <StatCard
          icon={<FaRupeeSign />}
          label="Total Budget"
          value={`₹${(stats?.totalBudget ?? 0).toLocaleString()}`}
          color="teal"
        />
        <StatCard
          icon={<FiTrendingUp />}
          label="Total Expenses"
          value={`₹${(stats?.totalExpenses ?? 0).toLocaleString()}`}
          color="sunset"
        />
        <StatCard
          icon={<FiGlobe />}
          label="Countries Visited"
          value={stats?.countriesVisited ?? 0}
          color="violet"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
            Trips Created Over Time
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="trips" fill="#0aa8f0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
            Expenses by Category
          </h3>
          {categoryData.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-sm text-slate-400">
              No expenses recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">Recent Trips</h3>
          <Link to="/trips" className="text-sm font-medium text-primary-500 hover:underline">
            View all
          </Link>
        </div>
        {stats?.recentTrips?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.recentTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        ) : (
          <GlassCard className="text-center text-sm text-slate-500 dark:text-slate-400">
            No trips yet. <Link to="/ai-planner" className="text-primary-500">Plan your first trip</Link>!
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
