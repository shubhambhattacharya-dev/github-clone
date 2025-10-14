import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../component/Spinner";
import { saveRepository } from "../lib/function";

const TrendsPage = () => {
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("daily");
  const [category, setCategory] = useState("dsa");
  const [language, setLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("stars");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingRepos();
  }, [timeRange, category, language, sortBy, searchQuery]);

  const fetchTrendingRepos = async () => {
    setLoading(true);
    try {
      let query = 'stars:>1';
      if (searchQuery.trim()) {
        query += ` ${searchQuery}`;
      } else {
        if (category === 'dsa') {
          query += ' algorithms OR "data structures" OR dsa';
        } else if (category === 'webdev') {
          query += ' javascript OR react OR vue OR angular';
        } else if (category === 'ai') {
          query += ' "machine learning" OR tensorflow OR pytorch OR ai';
        }
      }
      if (language !== 'all') {
        query += ` language:${language}`;
      }

      // GitHub trending API (using a public service)
      let apiUrl;
      if (sortBy === 'best') {
        // For "Best Match", use relevance sorting and then sort by combined score
        apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=&order=desc&per_page=50`;
      } else {
        apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sortBy}&order=desc&per_page=50`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Clone-App'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trending repositories');
      }

      const data = await response.json();
      let repos = data.items || [];

      // Custom sorting for "Best Match" - prioritize highly forked repos with good engagement
      if (sortBy === 'best') {
        repos = repos.sort((a, b) => {
          const scoreA = (a.forks_count || 0) * 2 + (a.stargazers_count || 0) + (a.watchers_count || 0);
          const scoreB = (b.forks_count || 0) * 2 + (b.stargazers_count || 0) + (b.watchers_count || 0);
          return scoreB - scoreA;
        });
      }

      // Limit to 20 results after sorting
      setTrendingRepos(repos.slice(0, 20));
    } catch (error) {
      console.error('Error fetching trending repos:', error);
      toast.error('Failed to load trending repositories');

      // Fallback data
      const fallbackRepos = [];
      if (category === 'dsa') {
        fallbackRepos.push(
          {
            id: 1,
            name: "javascript-algorithms",
            full_name: "trekhleb/javascript-algorithms",
            description: "Algorithms and data structures implemented in JavaScript with explanations and links to further readings",
            language: "JavaScript",
            stargazers_count: 170000,
            html_url: "https://github.com/trekhleb/javascript-algorithms"
          },
          {
            id: 2,
            name: "system-design-primer",
            full_name: "donnemartin/system-design-primer",
            description: "Learn how to design large-scale systems. Prep for the system design interview. Includes Anki flashcards.",
            language: "Python",
            stargazers_count: 210000,
            html_url: "https://github.com/donnemartin/system-design-primer"
          }
        );
      } else if (category === 'webdev') {
        fallbackRepos.push(
          {
            id: 1,
            name: "freeCodeCamp",
            full_name: "freeCodeCamp/freeCodeCamp",
            description: "freeCodeCamp.org's open-source codebase and curriculum. Learn to code for free.",
            language: "JavaScript",
            stargazers_count: 370000,
            html_url: "https://github.com/freeCodeCamp/freeCodeCamp"
          },
          {
            id: 2,
            name: "developer-roadmap",
            full_name: "kamranahmedse/developer-roadmap",
            description: "Interactive roadmaps, guides and other educational content to help developers grow in their career.",
            language: "TypeScript",
            stargazers_count: 240000,
            html_url: "https://github.com/kamranahmedse/developer-roadmap"
          },
          {
            id: 3,
            name: "next.js",
            full_name: "vercel/next.js",
            description: "The React Framework for Production - Build modern web applications with Next.js",
            language: "JavaScript",
            stargazers_count: 110000,
            html_url: "https://github.com/vercel/next.js"
          },
          {
            id: 4,
            name: "svelte",
            full_name: "sveltejs/svelte",
            description: "Cybernetically enhanced web apps - Modern JavaScript framework for building user interfaces",
            language: "JavaScript",
            stargazers_count: 72000,
            html_url: "https://github.com/sveltejs/svelte"
          },
          {
            id: 5,
            name: "astro",
            full_name: "withastro/astro",
            description: "Build faster websites with Astro's next-gen island architecture",
            language: "TypeScript",
            stargazers_count: 35000,
            html_url: "https://github.com/withastro/astro"
          },
          {
            id: 6,
            name: "tailwindcss",
            full_name: "tailwindlabs/tailwindcss",
            description: "A utility-first CSS framework for rapidly building custom user interfaces",
            language: "JavaScript",
            stargazers_count: 72000,
            html_url: "https://github.com/tailwindlabs/tailwindcss"
          }
        );
      } else if (category === 'ai') {
        fallbackRepos.push(
          {
            id: 1,
            name: "public-apis",
            full_name: "public-apis/public-apis",
            description: "A collective list of free APIs for use in software and web development.",
            language: "Python",
            stargazers_count: 250000,
            html_url: "https://github.com/public-apis/public-apis"
          },
          {
            id: 2,
            name: "awesome-machine-learning",
            full_name: "josephmisiti/awesome-machine-learning",
            description: "A curated list of awesome Machine Learning frameworks, libraries and software.",
            language: "Python",
            stargazers_count: 58000,
            html_url: "https://github.com/josephmisiti/awesome-machine-learning"
          },
          {
            id: 3,
            name: "transformers",
            full_name: "huggingface/transformers",
            description: "🤗 Transformers: State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX",
            language: "Python",
            stargazers_count: 110000,
            html_url: "https://github.com/huggingface/transformers"
          },
          {
            id: 4,
            name: "stable-diffusion",
            full_name: "CompVis/stable-diffusion",
            description: "A latent text-to-image diffusion model",
            language: "Jupyter Notebook",
            stargazers_count: 58000,
            html_url: "https://github.com/CompVis/stable-diffusion"
          },
          {
            id: 5,
            name: "whisper",
            full_name: "openai/whisper",
            description: "Robust Speech Recognition via Large-Scale Weak Supervision",
            language: "Python",
            stargazers_count: 45000,
            html_url: "https://github.com/openai/whisper"
          },
          {
            id: 6,
            name: "chatgpt-retrieval-plugin",
            full_name: "openai/chatgpt-retrieval-plugin",
            description: "The ChatGPT Retrieval Plugin lets you easily find personal or work documents by asking questions",
            language: "Python",
            stargazers_count: 18000,
            html_url: "https://github.com/openai/chatgpt-retrieval-plugin"
          }
        );
      }
      setTrendingRepos(fallbackRepos);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (repo) => {
    try {
      await saveRepository(repo);
      toast.success('Repository saved!');
    } catch (error) {
      toast.error(error.message || 'Failed to save repository');
    }
  };


  if (loading) {
    return (
      <div className="px-4">
        <div className="bg-glass max-w-4xl mx-auto rounded-md p-8">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Loading trending repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="bg-glass max-w-4xl mx-auto rounded-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Trending Repositories</h1>

          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => fetchTrendingRepos()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-2">
              {[
                { key: "daily", label: "Today" },
                { key: "weekly", label: "This Week" },
                { key: "monthly", label: "This Month" }
              ].map(range => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { key: "dsa", label: "DSA" },
                { key: "webdev", label: "Web Development" },
                { key: "ai", label: "AI" }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    category === cat.key
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { key: "all", label: "All Languages" },
                { key: "javascript", label: "JavaScript" },
                { key: "python", label: "Python" },
                { key: "java", label: "Java" },
                { key: "cpp", label: "C++" },
                { key: "c", label: "C" },
                { key: "typescript", label: "TypeScript" },
                { key: "go", label: "Go" }
              ].map(lang => (
                <button
                  key={lang.key}
                  onClick={() => setLanguage(lang.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    language === lang.key
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { key: "popular", sort: "stars", label: "Popular" },
                { key: "liked", sort: "stars", label: "Most Liked" },
                { key: "forks", sort: "forks", label: "Most Forks" },
                { key: "best", sort: "best", label: "Best Match" }
              ].map(sort => (
                <button
                  key={sort.key}
                  onClick={() => setSortBy(sort.sort)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    sortBy === sort.sort
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {trendingRepos.map((repo, index) => (
            <div key={repo.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-2xl font-bold text-gray-400 w-8 text-center">
                  #{index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {repo.full_name}
                      </a>
                    </h3>
                    {repo.language && (
                      <span className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  {repo.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        ⭐ {repo.stargazers_count?.toLocaleString() || 0}
                      </span>
                      {repo.forks_count && (
                        <span className="flex items-center gap-1">
                          🍴 {repo.forks_count.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(repo)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {trendingRepos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No trending repositories found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsPage;