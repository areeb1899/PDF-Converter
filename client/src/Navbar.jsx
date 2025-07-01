import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: "/word-to-pdf", label: "Word to PDF" },
    { path: "/jpg-to-pdf", label: "JPG to PDF" },
    { path: "/pdf-to-jpg", label: "PDF to JPG" },
    { path: "/compress-pdf", label: "Compress PDF" },
    { path: "/merge-pdf", label: "Merge PDF" },
  ];

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-[#2C2E3A]/60 backdrop-blur-md text-white shadow-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/pdf logo.png" width="28" alt="PDF Logo" />
          <h1 className="text-xl font-bold text-[#B3B4BD]">PDF Converter</h1>
        </div>
        

        {/* Hamburger button — visible below lg */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop nav — only visible lg and above */}
        <div className="hidden lg:flex gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-medium px-4 py-1 rounded-md whitespace-nowrap transition ${
                  isActive
                    ? "bg-gradient-to-r from-[#A8A857] to-[#D344A4] text-white shadow"
                    : "text-white hover:text-[#A8A857]"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile nav — only visible below lg */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden px-4 pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#A8A857] to-[#D344A4] text-white shadow"
                      : "text-white hover:text-[#A8A857]"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
