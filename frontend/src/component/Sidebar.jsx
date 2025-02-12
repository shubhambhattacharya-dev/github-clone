import React from 'react';
import { Link } from 'react-router-dom';
import { IoHomeSharp, IoMedalOutline } from "react-icons/io5"; // Corrected import
import { FaHeart } from "react-icons/fa";

const Sidebar = () => {
  const authUser = true;
  return (
    <aside className="group flex flex-col items-center min-w-12 sm:w-16 sticky top-0 left-0 h-screen py-8 overflow-y-auto
    bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-2xl // Removed transparency
    transition-all duration-500 ease-in-out
    border-r-2 border-white/15 hover:border-indigo-400/80 rounded-r-xl
    text-gray-100 hover:text-white/90 
    shadow-[0_0_25px_-10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.4)]
    relative overflow-hidden
    before:absolute before:inset-0 before:-left-24 before:bg-gradient-to-r before:from-indigo-400/15 before:via-indigo-400/05 before:to-transparent
    before:transition-all before:duration-500 before:ease-in-out before:opacity-0
    hover:before:opacity-100 hover:before:left-0
    after:absolute after:top-0 after:left-0 after:w-[2px] after:h-full after:bg-gradient-to-b after:from-indigo-400 after:via-purple-400 after:to-transparent
    after:opacity-0 after:transition-opacity after:duration-300
    hover:after:opacity-60
    [&>*]:transition-transform [&>*]:duration-300 [&>*]:hover:scale-110
    [&>*]:hover:text-indigo-300 [&>*]:active:scale-95">
      <nav className='h-full flex flex-col gap-3'>
        <Link to='/' className='flex justify-center'>
          <img className='h-8' src="/github.svg" alt="Github Logo" />
        </Link>
        <Link to='/' className='p-1.5 flex justify-center transition-colors duration-200 rounded-lg hover:bg-gray-800'>
          <IoHomeSharp size={22} />
        </Link>
        {authUser && (
          <Link to='/likes' className='p-1.5 flex justify-center transition-colors duration-200 rounded-lg hover:bg-gray-800'>
            <FaHeart size={22} />
          </Link>
        )}
        {authUser && (
          <Link to='/explore' className='p-1.5 flex justify-center transition-colors duration-200 rounded-lg hover:bg-gray-800'>
            <IoMedalOutline size={22} /> {/* Replaced image with icon */}
          </Link>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;