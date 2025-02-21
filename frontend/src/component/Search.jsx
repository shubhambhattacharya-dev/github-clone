import { IoSearch } from 'react-icons/io5';

const Search = () => {
  return (
    <form className='max-w-2xl mx-auto p-2 sm:w-96'>
      <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only'>
        Search
      </label>
      <div className='relative group'>
        <div className='absolute inset-y-0 start-0 flex items-center z-10 ps-3 pointer-events-none'>
          <IoSearch className='w-6 h-6 text-gray-500 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-blue-400' />
        </div>
        <input
          type='search'
          id='default-search'
          className='block w-full p-5 ps-14 text-lg rounded-xl bg-glass border-2 border-blue-400/20 
          backdrop-blur-xl focus:border-blue-500/40 focus:outline-none 
          placeholder-gray-500/70 hover:border-blue-400/30 
          transition-all duration-500 shadow-xl 
          shadow-blue-900/10 hover:shadow-blue-900/20 focus:shadow-blue-900/30'
          placeholder='Search username...'
          required
        />
        <button
          type='submit'
          className='absolute end-3 bottom-3 bg-glass border-2 border-blue-400/30 hover:border-blue-500/40 
          backdrop-blur-lg focus:outline-none 
          font-semibold rounded-lg text-sm px-7 py-3.5 text-gray-300 
          shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 
          hover:scale-[98%] active:scale-95 transition-all 
          duration-300 flex items-center gap-2 hover:text-blue-400'
        >
          <span>Search</span>
          <svg 
            className='w-5 h-5 -mr-1 group-hover:translate-x-1 transition-transform' 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default Search;