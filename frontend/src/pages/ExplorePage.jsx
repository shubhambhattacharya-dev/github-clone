import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../component/Spinner";
import Repos from "../component/Repos"; // Ensure this component is imported

const ExplorePage = () => {
	// https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=10
	const [loading, setLoading] = useState(false);
	const [repos, setRepos] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState("");

	const exploreRepos = async (language) => {
		setLoading(true);
		setRepos([]);
		setSelectedLanguage(language); // Update the selected language
		try {
			//5000 request per hr for authenticated
			//16 request per hr unknown
			const res = await fetch(
				`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,{
					headers: {
						'Authorization: token': `token ${import.meta.env.VITE_GITHUB_API_KEY}`,
					}
				}
			);
			const data = await res.json();
			setRepos(data.items); // Set the repos from the fetched data
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='px-4'>
			<div className='bg-glass max-w-2xl mx-auto rounded-md p-4'>
				<h1 className='text-xl font-bold text-center'>Explore Popular Repositories</h1>
				<div className='flex flex-wrap gap-2 my-2 justify-center'>
					<img
						src='/javascript.svg'
						alt='JavaScript logo'
						className='h-11 sm:h-20 cursor-pointer'
						onClick={() => exploreRepos("javascript")}
					/>
					<img
						src='/typescript.svg'
						alt='TypeScript logo'
						className='h-11 sm:h-20 cursor-pointer'
						onClick={() => exploreRepos("typescript")}
					/>
					<img
						src='/c++.svg'
						alt='C++ logo'
						className='h-11 sm:h-20 cursor-pointer'
						onClick={() => exploreRepos("c++")}
					/>
					<img
						src='/python.svg'
						alt='Python logo'
						className='h-11 sm:h-20 cursor-pointer'
						onClick={() => exploreRepos("python")}
					/>
					<img
						src='/java.svg'
						alt='Java logo'
						className='h-11 sm:h-20 cursor-pointer'
						onClick={() => exploreRepos("java")}
					/>
				</div>
				{repos.length > 0 && (
					<h2 className='text-lg font-semibold text-center my-4'>
						<span className='bg-blue-100 text-blue-800 font-medium me-2 px-2.5 py-0.5 rounded-full'>
							{selectedLanguage.toUpperCase()}{" "}
						</span>
						Repositories
					</h2>
				)}
				{!loading && repos.length > 0 && <Repos repos={repos} alwaysFullWidth />}
				{loading && <Spinner />}
			</div>
		</div>
	);
};

export default ExplorePage;
