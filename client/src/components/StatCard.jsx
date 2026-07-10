import React from "react";
import GlassCard from "./GlassCard";

const colorMap = {
  primary: "bg-primary-500/15 text-primary-600 dark:text-primary-400",
  sunset: "bg-sunset-500/15 text-sunset-600 dark:text-sunset-400",
  teal: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
};

const StatCard = ({ icon, label, value, color = "primary", suffix = "" }) => {
  return (
    <GlassCard className="flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-white">
          {value}
          {suffix}
        </p>
      </div>
    </GlassCard>
  );
};

export default StatCard;
