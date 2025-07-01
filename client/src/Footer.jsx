import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
     className="w-full bg-gradient-to-r from-[#1f2937] via-[#374151] to-[#1f2937] bg-opacity-60 backdrop-blur-md text-white py-6 mt-10 shadow-inner"

    >
      <div className="text-center space-y-2">
        <h4 className="text-sm text-[#D1D5DB]">
          &copy; {year} <span className="font-semibold">Areeb Ahmed</span>. All rights reserved.
        </h4>
        <p className="text-xs text-[#9CA3AF]">
          Built with ❤️ | Designed to simplify your document conversions
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
