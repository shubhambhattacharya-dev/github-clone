import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

const Search = ({ onSearch }) => {
  const [username, setUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Track search state

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(e, username);
    setIsSearching(false); // Change text color to black after search
  };

  return (
    <form className='max-w-2xl mx-auto p-2' onSubmit={handleSubmit}>
      <label
        htmlFor='default-search'
        className='mb-2 text-sm font-medium text-gray-900 sr-only'
      >
        Search
      </label>
      <div className='relative group'>
        <div className='absolute inset-y-0 start-0 flex items-center z-10 ps-3 pointer-events-none'>
          <IoSearch className='w-6 h-6 text-gray-300 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-blue-300' />
        </div>
        <input
          type='search'
          id='default-search'
          className={`block w-full p-4 ps-12 text-md rounded-lg bg-glass border border-gray-600/30
          backdrop-blur-2xl focus:border-blue-400/40 focus:outline-none
          placeholder-gray-400/80 transition-all duration-300 shadow-2xl
          shadow-gray-900/20 focus:shadow-blue-900/40 text-white`}
          placeholder='Search username...'
          required
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsSearching(true); // Change text to white while typing
          }}
        />
        <button
          type='submit'
          className='absolute end-2.5 bottom-2 bg-gradient-to-br from-blue-500/80 to-blue-600/90 border border-blue-400/30 
          backdrop-blur-lg focus:outline-none 
          font-medium rounded-lg text-sm px-5 py-2.5 text-gray-100 
          shadow-lg shadow-blue-900/30 hover:shadow-blue-900/40 
          hover:scale-[98%] active:scale-95 transition-all 
          duration-300 flex items-center gap-1 hover:text-white'
        >
          <span>Search</span>
          <svg
            className='w-4 h-4 -mr-1 group-hover:translate-x-1 transition-transform'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default Search;
