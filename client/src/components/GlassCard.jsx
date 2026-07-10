import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      className={`glass-card p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
