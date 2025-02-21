import React, { useState } from 'react';

const SortRepos = () => {
  const [sortType, setSortType] = useState('recent');

  const handleSort = (type) => {
    setSortType(type);
    // Add your actual sorting logic here
  };

  const buttonStyle = (type) => 
    `py-2.5 px-5 me-2 mb-2 text-xs sm:text-sm font-medium focus:outline-none rounded-lg transition-all duration-300 bg-glass border border-transparent ${
      sortType === type 
        ? 'border-blue-500/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30' 
        : 'hover:border-gray-600/50 hover:shadow-md hover:shadow-gray-500/10'
    }`;

  return (
    <div className='mb-2 flex justify-center lg:justify-end'>
      <button
        type='button'
        onClick={() => handleSort('recent')}
        className={buttonStyle('recent')}
      >
        Most Recent
      </button>
      <button
        type='button'
        onClick={() => handleSort('stars')}
        className={buttonStyle('stars')}
      >
        Most Stars
      </button>
      <button
        type='button'
        onClick={() => handleSort('forks')}
        className={buttonStyle('forks')}
      >
        Most Forks
      </button>
    </div>
  );
};

export default SortRepos;