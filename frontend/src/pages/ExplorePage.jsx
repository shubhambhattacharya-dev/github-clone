import PropTypes from 'prop-types';

/**
 * ExplorePage component displays popular programming language icons
 * @param {Object} props - Component props
 * @param {Array} props.languages - Array of language objects
 */
const ExplorePage = ({ languages = [
  { name: 'JavaScript', icon: 'javascript.svg' },
  { name: 'TypeScript', icon: 'typescript.svg' },
  { name: 'C++', icon: 'c++.svg' },
  { name: 'Python', icon: 'python.svg' },
  { name: 'Java', icon: 'java.svg' }
] }) => {

	return (
		<div className='px-4'>
			<div className='bg-glass max-w-2xl mx-auto rounded-md p-4'>
				<h1 className='text-xl font-bold text-center'>Explore Popular Repositories</h1>
				<div className='flex flex-wrap gap-2 my-2 justify-center'>
					{languages.map((lang, index) => (
						<img 
							key={index}
							src={lang.icon} 
							alt={`${lang.name} logo`} 
							className='h-11 sm:h-20 cursor-pointer'
							role="img"
							aria-label={lang.name}
							tabIndex={0}
						/>
					))}

				</div>
			</div>
		</div>
	);
};

ExplorePage.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  )
};

export default ExplorePage;
