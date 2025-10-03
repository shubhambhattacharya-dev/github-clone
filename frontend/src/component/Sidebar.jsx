import React from 'react';
import { Link } from 'react-router-dom';
import { IoHomeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import Logout from './Logout';
import { PiSignInBold } from "react-icons/pi";
import { MdEditDocument } from 'react-icons/md';
import { AiOutlineSave } from "react-icons/ai"; // New icon for Saved
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from "react-icons/fa";

const Sidebar = () => {
  const { authUser } = useAuthContext(); // Get authUser from context
  const { theme, toggleTheme } = useTheme();

  // Reorganized by importance/priority (most important first)
  const navItems = [
    // Core navigation (always visible)
    { path: '/', icon: <IoHomeSharp size={22} />, label: 'Home', visible: true, priority: 1 },

    // Primary authenticated features (high priority)
    { path: '/explore', icon: <MdOutlineExplore size={22} />, label: 'Explore', visible: !!authUser, priority: 2 },
    { path: '/trends', icon: '📈', label: 'Trends', visible: !!authUser, priority: 3 },

    // Social features (medium priority)
    { path: '/likes', icon: <FaHeart size={22} />, label: 'Likes', visible: !!authUser, priority: 4 },
    { path: '/saved', icon: <AiOutlineSave size={22} />, label: 'Saved', visible: !!authUser, priority: 5 },

    // Creative features (medium priority)
    { path: '/contribution-art', icon: '🎨', label: 'Art Generator', visible: !!authUser, priority: 6 },

    // Analytics & achievements (lower priority)
    { path: '/analytics', icon: <FaSave size={22} />, label: 'Analytics', visible: !!authUser, priority: 7 },
    { path: '/achievements', icon: '🏆', label: 'Achievements', visible: !!authUser, priority: 8 },

    // Authentication (lowest priority, only when not logged in)
    { path: '/login', icon: <PiSignInBold size={22} />, label: 'Login', visible: !authUser, priority: 9 },
    { path: '/signup', icon: <MdEditDocument size={22} />, label: 'Sign Up', visible: !authUser, priority: 10 }
  ];

  return (
    <aside 
      aria-label="Main navigation"
      className="group flex flex-col items-center min-w-12 sm:w-16 sticky top-0 left-0 h-screen py-8 overflow-y-auto
      bg-gradient-to-b from-gray-800/40 to-gray-900/30 backdrop-blur-2xl
      border-r-2 border-white/15 hover:border-indigo-400/80 rounded-r-xl
      text-gray-100 hover:text-white/90 
      shadow-[0_0_25px_-10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.4)]
      overflow-hidden
      after:absolute after:top-0 after:left-0 after:w-[2px] after:h-full after:bg-gradient-to-b after:from-indigo-400 after:via-purple-400 after:to-transparent
      after:opacity-0 hover:after:opacity-60"
    >
      {/* Skip navigation link for screen readers */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg">
        Skip to main content
      </a>

      <nav className="h-full flex flex-col gap-3" aria-label="Primary navigation">
        <Link 
          to="/" 
          className="flex justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded-lg"
          aria-label="Home"
        >
          <img 
            className="h-8 w-8" 
            src="/github.svg" 
            alt="GitHub Logo" 
            loading="lazy"
            width="32"
            height="32"
          />
        </Link>

        {navItems
          .filter(item => item.visible) // Ensure only visible items are mapped
          .map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="p-1.5 flex justify-center transition-colors duration-200 rounded-lg 
                     hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={item.label}
              role="link"
              tabIndex={0}
            >
              {item.icon}
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}

        <div className="flex flex-col mt-auto gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 flex justify-center transition-colors duration-200 rounded-lg
                   hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FaMoon size={22} /> : <FaSun size={22} />}
            <span className="sr-only">Toggle theme</span>
          </button>
          {authUser && (
            <Logout
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded-lg"
              aria-label="Logout"
            />
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
