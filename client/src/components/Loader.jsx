import React from "react";
import { motion } from "framer-motion";

const Loader = ({ fullScreen = false, label = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        {content}
      </div>
    );
  }

  return <div className="flex w-full items-center justify-center py-16">{content}</div>;
};

export default Loader;
