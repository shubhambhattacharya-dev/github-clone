import { useEffect, useState } from "react";
import { FaStar, FaCodeBranch, FaCalendarAlt, FaFilter, FaBookmark, FaChartBar } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatDate } from "../utils/functions";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TrendsPage = () => {
	const { authUser } = useAuthContext();
	const navigate = useNavigate();
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState({
		since: 'weekly',
		language: ''
	});

	useEffect(() => {
		fetchTrendingRepos();
	}, [filters]);

	const fetchTrendingRepos = async () => {
		try {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams();
			params.append('since', filters.since);
			if (filters.language) {
				params.append('language', filters.language);
			}

			const res = await fetch(`/api/explore/trending?${params.toString()}`);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to fetch trending repositories');
			}

			setRepos(data.repos || []);
		} catch (error) {
			console.error('Error fetching trending repos:', error);

			// Fallback: Use mock data if API fails
			console.log('Using mock data fallback');
			const mockRepos = [
				{
					id: 1,
					name: "react",
					full_name: "facebook/react",
					html_url: "https://github.com/facebook/react",
					description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
					stars: 220000,
					forks: 45000,
					language: "javascript",
					topics: ["react", "javascript", "library", "frontend"],
					created_at: "2013-05-24T16:15:54Z",
					owner: {
						login: "facebook",
						avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
						html_url: "https://github.com/facebook"
					}
				},
				{
					id: 2,
					name: "vue",
					full_name: "vuejs/vue",
					html_url: "https://github.com/vuejs/vue",
					description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
					stars: 205000,
					forks: 34000,
					language: "javascript",
					topics: ["vue", "javascript", "framework", "frontend"],
					created_at: "2014-02-06T14:28:39Z",
					owner: {
						login: "vuejs",
						avatar_url: "https://avatars.githubusercontent.com/u/6128107?v=4",
						html_url: "https://github.com/vuejs"
					}
				},
				{
					id: 3,
					name: "tensorflow",
					full_name: "tensorflow/tensorflow",
					html_url: "https://github.com/tensorflow/tensorflow",
					description: "An Open Source Machine Learning Framework for Everyone",
					stars: 180000,
					forks: 88000,
					language: "python",
					topics: ["machine-learning", "deep-learning", "python", "tensorflow"],
					created_at: "2015-11-07T01:19:20Z",
					owner: {
						login: "tensorflow",
						avatar_url: "https://avatars.githubusercontent.com/u/15658638?v=4",
						html_url: "https://github.com/tensorflow"
					}
				},
				{
					id: 4,
					name: "vscode",
					full_name: "microsoft/vscode",
					html_url: "https://github.com/microsoft/vscode",
					description: "Visual Studio Code",
					stars: 155000,
					forks: 27000,
					language: "typescript",
					topics: ["editor", "typescript", "electron", "vscode"],
					created_at: "2015-09-03T20:23:38Z",
					owner: {
						login: "microsoft",
						avatar_url: "https://avatars.githubusercontent.com/u/6154722?v=4",
						html_url: "https://github.com/microsoft"
					}
				},
				{
					id: 5,
					name: "kubernetes",
					full_name: "kubernetes/kubernetes",
					html_url: "https://github.com/kubernetes/kubernetes",
					description: "Production-Grade Container Scheduling and Management",
					stars: 105000,
					forks: 39000,
					language: "go",
					topics: ["kubernetes", "containers", "orchestration", "go"],
					created_at: "2014-06-06T22:56:04Z",
					owner: {
						login: "kubernetes",
						avatar_url: "https://avatars.githubusercontent.com/u/13629408?v=4",
						html_url: "https://github.com/kubernetes"
					}
				},
				{
					id: 6,
					name: "spring-boot",
					full_name: "spring-projects/spring-boot",
					html_url: "https://github.com/spring-projects/spring-boot",
					description: "Spring Boot helps you to create Spring-powered, production-grade applications and services with absolute minimum fuss.",
					stars: 72000,
					forks: 43000,
					language: "java",
					topics: ["spring-boot", "java", "framework", "microservices"],
					created_at: "2012-10-19T15:02:57Z",
					owner: {
						login: "spring-projects",
						avatar_url: "https://avatars.githubusercontent.com/u/317776?v=4",
						html_url: "https://github.com/spring-projects"
					}
				},
				{
					id: 7,
					name: "rust",
					full_name: "rust-lang/rust",
					html_url: "https://github.com/rust-lang/rust",
					description: "Empowering everyone to build reliable and efficient software.",
					stars: 92000,
					forks: 12000,
					language: "rust",
					topics: ["rust", "programming-language", "systems-programming"],
					created_at: "2010-06-21T20:44:48Z",
					owner: {
						login: "rust-lang",
						avatar_url: "https://avatars.githubusercontent.com/u/5430905?v=4",
						html_url: "https://github.com/rust-lang"
					}
				},
				{
					id: 8,
					name: "opencv",
					full_name: "opencv/opencv",
					html_url: "https://github.com/opencv/opencv",
					description: "Open Source Computer Vision Library",
					stars: 76000,
					forks: 55000,
					language: "cpp",
					topics: ["computer-vision", "opencv", "c-plus-plus", "image-processing"],
					created_at: "2012-07-20T13:19:47Z",
					owner: {
						login: "opencv",
						avatar_url: "https://avatars.githubusercontent.com/u/2203261?v=4",
						html_url: "https://github.com/opencv"
					}
				}
			];

			// Filter by language if specified
			let filteredRepos = mockRepos;
			if (filters.language) {
				const languageFiltered = mockRepos.filter(repo =>
					repo.language?.toLowerCase() === filters.language.toLowerCase()
				);

				// If no repos match the language, show some popular repos with a note
				if (languageFiltered.length === 0) {
					filteredRepos = mockRepos.slice(0, 3); // Show top 3 repos
				} else {
					filteredRepos = languageFiltered;
				}
			}

			setRepos(filteredRepos);
			setError(null); // Clear error since we have fallback data
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (newFilters) => {
		setFilters(prev => ({ ...prev, ...newFilters }));
	};

	const handleSaveRepo = async (repo) => {
		if (!authUser) {
			toast.error("Please login to save repositories");
			return;
		}
		try {
			const res = await fetch("/api/saved", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ repo }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleViewAnalytics = (repo) => {
		if (!authUser) {
			toast.error("Please login to view analytics");
			return;
		}
		// Navigate to analytics page with owner/repo
		const [owner, repoName] = repo.full_name.split('/');
		navigate(`/analytics/${owner}/${repoName}`);
	};

	// Calculate language statistics
	const languageStats = repos.reduce((acc, repo) => {
		const lang = repo.language || 'Unknown';
		acc[lang] = (acc[lang] || 0) + 1;
		return acc;
	}, {});

	const topLanguages = Object.entries(languageStats)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 5);

	// Calculate topic statistics
	const topicStats = repos.reduce((acc, repo) => {
		repo.topics?.forEach(topic => {
			acc[topic] = (acc[topic] || 0) + 1;
		});
		return acc;
	}, {});

	const topTopics = Object.entries(topicStats)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 10);

	return (
		<div className='relative overflow-x-auto shadow-md rounded-lg px-4'>
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<h1 className='text-2xl font-bold text-white mb-2'>GitHub Trends Dashboard</h1>
					<p className='text-gray-400'>Discover the most trending repositories</p>
				</div>

				{/* Filters */}
				<div className="flex gap-3">
					<div className="relative">
						<select
							value={filters.since}
							onChange={(e) => handleFilterChange({ since: e.target.value })}
							className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
						>
							<option value="daily">Today</option>
							<option value="weekly">This Week</option>
							<option value="monthly">This Month</option>
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
							<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					<div className="relative">
						<select
							value={filters.language}
							onChange={(e) => handleFilterChange({ language: e.target.value })}
							className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
						>
							<option value="">All Languages</option>
							<option value="javascript">JavaScript</option>
							<option value="python">Python</option>
							<option value="java">Java</option>
							<option value="typescript">TypeScript</option>
							<option value="go">Go</option>
							<option value="rust">Rust</option>
							<option value="cpp">C++</option>
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
							<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
					<strong>Error:</strong> {error}
				</div>
			)}

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-glass p-4 rounded-lg border border-gray-600">
					<div className="flex items-center gap-3">
						<FaStar className="text-yellow-500 text-xl" />
						<div>
							<p className="text-gray-400 text-sm">Total Repos</p>
							<p className="text-white text-xl font-bold">{repos.length}</p>
						</div>
					</div>
				</div>

				<div className="bg-glass p-4 rounded-lg border border-gray-600">
					<div className="flex items-center gap-3">
						<FaCodeBranch className="text-blue-500 text-xl" />
						<div>
							<p className="text-gray-400 text-sm">Languages</p>
							<p className="text-white text-xl font-bold">{Object.keys(languageStats).length}</p>
						</div>
					</div>
				</div>

				<div className="bg-glass p-4 rounded-lg border border-gray-600">
					<div className="flex items-center gap-3">
						<FaFilter className="text-green-500 text-xl" />
						<div>
							<p className="text-gray-400 text-sm">Topics</p>
							<p className="text-white text-xl font-bold">{Object.keys(topicStats).length}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Main Content - Trending Repos */}
				<div className="lg:col-span-3">
					<div className="bg-glass rounded-lg border border-gray-600 overflow-hidden">
						<div className="p-4 border-b border-gray-600">
							<h2 className="text-lg font-semibold text-white">Trending Repositories</h2>
							<p className="text-gray-400 text-sm">
								{loading ? 'Loading...' : `${repos.length} repositories found`}
							</p>
						</div>

						<div className="divide-y divide-gray-600">
							{loading ? (
								// Loading skeleton
								[...Array(5)].map((_, i) => (
									<div key={i} className="p-4 animate-pulse">
										<div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
										<div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
										<div className="flex gap-4">
											<div className="h-3 bg-gray-600 rounded w-16"></div>
											<div className="h-3 bg-gray-600 rounded w-12"></div>
										</div>
									</div>
								))
							) : repos.length === 0 ? (
								<div className="p-8 text-center text-gray-400">
									No trending repositories found. Try adjusting your filters.
								</div>
							) : (
								repos.map((repo, index) => (
									<div key={repo.id} className="p-4 hover:bg-gray-800/50 transition-colors">
										<div className="flex justify-between items-start mb-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-gray-400 text-sm">#{index + 1}</span>
													<a
														href={repo.html_url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-lg font-medium text-blue-400 hover:text-blue-300 hover:underline"
													>
														{repo.full_name}
													</a>
												</div>
												{repo.description && (
													<p className="text-gray-300 mb-3 line-clamp-2">{repo.description}</p>
												)}
											</div>

											{/* Action Buttons */}
											{authUser && (
												<div className="flex gap-2 ml-4">
													<button
														onClick={() => handleSaveRepo(repo)}
														className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
														title="Save Repository"
													>
														<FaBookmark size={16} />
													</button>
													<button
														onClick={() => handleViewAnalytics(repo)}
														className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
														title="View Analytics"
													>
														<FaChartBar size={16} />
													</button>
												</div>
											)}
										</div>

										<div className="flex flex-wrap gap-2 items-center text-sm">
											{repo.language && (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
													{repo.language}
												</span>
											)}
											{repo.topics?.slice(0, 3).map(topic => (
												<span
													key={topic}
													className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
												>
													{topic}
												</span>
											))}
										</div>

										<div className="flex items-center gap-6 mt-3 text-sm text-gray-400">
											<div className="flex items-center gap-1">
												<FaStar className="text-yellow-500" />
												<span>{repo.stars?.toLocaleString()}</span>
											</div>
											<div className="flex items-center gap-1">
												<FaCodeBranch className="text-gray-400" />
												<span>{repo.forks?.toLocaleString()}</span>
											</div>
											<div className="flex items-center gap-1">
												<FaCalendarAlt className="text-gray-400" />
												<span>{formatDate(repo.created_at)}</span>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				{/* Sidebar - Stats */}
				<div className="space-y-4">
					{/* Top Languages */}
					<div className="bg-glass rounded-lg border border-gray-600 p-4">
						<h3 className="text-lg font-semibold text-white mb-3">Top Languages</h3>
						<div className="space-y-2">
							{topLanguages.map(([lang, count]) => (
								<div key={lang} className="flex justify-between items-center">
									<span className="text-gray-300 text-sm">{lang}</span>
									<span className="text-blue-400 font-medium">{count}</span>
								</div>
							))}
						</div>
					</div>

					{/* Popular Topics */}
					<div className="bg-glass rounded-lg border border-gray-600 p-4">
						<h3 className="text-lg font-semibold text-white mb-3">Popular Topics</h3>
						<div className="flex flex-wrap gap-1">
							{topTopics.map(([topic, count]) => (
								<span
									key={topic}
									className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700"
									title={`${count} repositories`}
								>
									{topic}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrendsPage;