import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import GlassCard from "../components/GlassCard";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import * as expenseService from "../services/expenseService";
import * as tripService from "../services/tripService";

const categories = ["accommodation", "food", "transport", "activities", "shopping", "misc"];

const emptyForm = { title: "", amount: "", category: "misc", date: "", notes: "" };

const BudgetTrackerPage = () => {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get("trip") || "";

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(tripIdParam);
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const currentTrip = trips.find((t) => t._id === selectedTrip);

  const fetchTrips = async () => {
    const { data } = await tripService.getTrips();
    setTrips(data.trips);
    if (!selectedTrip && data.trips.length) setSelectedTrip(data.trips[0]._id);
  };

  const fetchExpenses = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const { data } = await expenseService.getExpenses(tripId);
      setExpenses(data.expenses);
      setTotalSpent(data.totalSpent);
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTrip) fetchExpenses(selectedTrip);
  }, [selectedTrip]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseDate = new Date(form.date);
    if (
      !form.date ||
      isNaN(expenseDate.getTime()) ||
      expenseDate.getFullYear() < 2000 ||
      expenseDate.getFullYear() > 2100
    ) {
      toast.error("Please enter a valid expense date.");
      return;
    }



    if (!selectedTrip) {
      toast.error("Select a trip first");
      return;
    }
    try {
      if (editingId) {
        await expenseService.updateExpense(editingId, form);
        toast.success("Expense updated");
      } else {
        await expenseService.createExpense({ ...form, trip: selectedTrip });
        toast.success("Expense added");
      }
      resetForm();
      fetchExpenses(selectedTrip);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.slice(0, 10) || "",
      notes: expense.notes || "",
    });
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await expenseService.deleteExpense(expenseId);
      toast.success("Expense deleted");
      fetchExpenses(selectedTrip);
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const budget = currentTrip?.budget || 0;
  const remaining = budget - totalSpent;

  const chartData = [{ name: "Budget vs Spent", Budget: budget, Spent: totalSpent }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Budget & Expense Tracker</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track spending against your trip budget
        </p>
      </div>

      <GlassCard>
        <label className="label-text">Select Trip</label>
        <select
          className="input-field max-w-md"
          value={selectedTrip}
          onChange={(e) => setSelectedTrip(e.target.value)}
        >
          {trips.map((t) => (
            <option key={t._id} value={t._id}>
              {t.destination} (₹{t.budget?.toLocaleString()})
            </option>
          ))}
        </select>
      </GlassCard>

      {selectedTrip && (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <StatCard icon="💰" label="Total Budget" value={`₹${budget.toLocaleString()}`} color="teal" />
            <StatCard icon="📉" label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} color="sunset" />
            <StatCard
              icon={remaining >= 0 ? "✅" : "⚠️"}
              label={remaining >= 0 ? "Remaining Budget" : "Over Budget"}
              value={`₹${Math.abs(remaining).toLocaleString()}`}
              color={remaining >= 0 ? "primary" : "sunset"}
            />
          </div>

          <GlassCard>
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">Budget vs Expenses</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Budget" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Spent" fill="#ff7a45" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
              {editingId ? "Edit Expense" : "Add Expense"}
            </h3>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <input
                placeholder="Title"
                required
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                required
                min={0}
                className="input-field"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <button type="submit" className="btn-primary">
                <FiPlus /> {editingId ? "Update" : "Add"}
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-0">
            {loading ? (
              <Loader label="Loading expenses..." />
            ) : expenses.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No expenses recorded for this trip yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp._id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-4 font-medium text-slate-700 dark:text-slate-200">{exp.title}</td>
                        <td className="p-4 capitalize text-slate-500 dark:text-slate-400">{exp.category}</td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-white">
                          ₹{exp.amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(exp)} className="text-primary-500">
                              <FiEdit2 />
                            </button>
                            <button onClick={() => handleDelete(exp._id)} className="text-red-500">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
};

export default BudgetTrackerPage;
