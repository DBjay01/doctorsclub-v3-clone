"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link"; 
import { FaBars, FaTimes } from "react-icons/fa";
import Image from 'next/image'

export const FloatingNav = ({
  navItems,
  className,
  logo,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  logo?: string;
  className?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex max-w-[70%] sm:max-w-[35%] fixed top-8 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[9999] pr-4 pl-6 py-1 items-center justify-between space-x-4", // Adjusted spacing with space-x-4
        className
      )}   
    >
      {/* Logo Section */}
      {logo && (
        <Link href="/" className="flex items-center">
          <Image
            src={logo} 
            alt="Logo"
            className="h-21 w-20 mr-4" // Added margin-right to create space between the logo and hamburger menu
          />
        </Link>    
      )}

      {/* Hamburger Menu for small screens */}
      <div className="sm:hidden flex items-center ml-auto"> {/* Added ml-auto to push the menu to the right */}
        <button onClick={toggleMenu} className="text-neutral-600 dark:text-white focus:outline-none">
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Nav Items for large screens */}
      <div className="hidden sm:flex items-center space-x-8"> {/* Increased space between nav items */}
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            href={navItem.link}
            className="relative dark:text-neutral-50 flex items-center space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
      </div>

      {/* Get Started button for large screens */}
      <Link href="/sign-up" className="hidden sm:block">
        <button className="text-sm font-medium dark:border-white/[0.2] text-black dark:text-white bg-gradient-to-r from-blue-50 via-blue-400 to-blue-800 px-8 py-3 rounded-full">
          <span>Get Started</span>
        </button>
      </Link>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 w-full bg-white dark:bg-black shadow-lg rounded-lg mt-2 z-50 sm:hidden"
        >
          <div className="flex flex-col p-4 space-y-4 items-center"> {/* Centered and spaced mobile menu */}
            {navItems.map((navItem, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={navItem.link}
                className="text-base dark:text-neutral-50 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                onClick={toggleMenu} // Close menu on selection
              >
                <div className="flex items-center space-x-2">
                  {navItem.icon}
                  <span>{navItem.name}</span>
                </div>
              </Link>
            ))}

            {/* Mobile "Get Started" Button */}
            <Link href="/sign-up" onClick={toggleMenu}>
              <button className="w-full text-sm font-medium dark:border-white/[0.2] text-black dark:text-white bg-gradient-to-r from-blue-50 via-blue-400 to-blue-800 px-4 py-2 rounded-full">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};  