import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Logout from "./Logout";

const Sidebar = () => {
  const { authUser } = useAuthContext();
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/explore", icon: "🔍", label: "Explore" },
    { path: "/likes", icon: "❤️", label: "Likes" },
    { path: "/saved", icon: "💾", label: "Saved" },
    { path: "/starred", icon: "⭐", label: "Starred" },
    { path: "/achievements", icon: "🏆", label: "Achievements" },
    { path: "/analytics", icon: "📊", label: "Analytics" },
    { path: "/contribution-art", icon: "🎨", label: "Contribution Art" },
    { path: "/trends", icon: "📈", label: "Trends" },
    { path: "/placement", icon: "🎓", label: "Placement Prep" },
    { path: "/hackathon-os", icon: "🏆", label: "Hackathon & OS" },
    { path: "/todo", icon: "✅", label: "Daily Goals" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">GitHub Clone</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-4 border-t border-gray-700">
        {authUser ? (
          <div className="text-center">
            <img
              src={authUser.avatarUrl}
              alt={authUser.name}
              className="w-12 h-12 rounded-full mx-auto mb-2"
            />
            <p className="text-sm text-gray-300 mb-4">{authUser.name}</p>
            <Logout />
          </div>
        ) : (
          <Link
            to="/login"
            className="block text-center px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;