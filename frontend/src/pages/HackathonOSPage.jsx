import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../component/Spinner";
import { saveRepository } from "../lib/function";

const HackathonOSPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("hackathon");
  const [language, setLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("stars");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathonOSRepos();
  }, [category, language, sortBy]);

  const fetchHackathonOSRepos = async () => {
    setLoading(true);
    try {
      let query = 'stars:>1';
      if (category === 'hackathon') {
        query += ' hackathon OR "hackathon guide" OR "win hackathon"';
      } else if (category === 'opensource') {
        query += ' "open source contribution" OR "contributing to open source" OR "open source guide"';
      }
      if (language !== 'all') {
        query += ` language:${language}`;
      }

      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sortBy}&order=desc&per_page=20`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Clone-App'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hackathon/open source repositories');
      }

      const data = await response.json();
      setRepos(data.items || []);
    } catch (error) {
      console.error('Error fetching hackathon/open source repos:', error);
      toast.error('Failed to load repositories');

      // Fallback data
      const fallbackRepos = [];
      if (category === 'hackathon') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'hackathon-starter',
            full_name: 'sahat/hackathon-starter',
            description: 'A boilerplate for Node.js web applications with authentication, payments, and more',
            language: 'JavaScript',
            stargazers_count: 34000,
            html_url: 'https://github.com/sahat/hackathon-starter'
          },
          {
            id: 2,
            name: 'hackathon-toolkit',
            full_name: 'google/hackathon-toolkit',
            description: 'Gathering the best resources for running a hackathon',
            language: 'Various',
            stargazers_count: 1200,
            html_url: 'https://github.com/google/hackathon-toolkit'
          },
          {
            id: 3,
            name: 'how-to-win-hackathons',
            full_name: 'pnakov/how-to-win-hackathons',
            description: 'A guide on how to win hackathons with step-by-step instructions',
            language: 'Various',
            stargazers_count: 850,
            html_url: 'https://github.com/pnakov/how-to-win-hackathons'
          }
        );
      } else if (category === 'opensource') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'first-contributions',
            full_name: 'firstcontributions/first-contributions',
            description: '🚀✨ Help beginners to contribute to open source projects',
            language: 'Various',
            stargazers_count: 36000,
            html_url: 'https://github.com/firstcontributions/first-contributions'
          },
          {
            id: 2,
            name: 'up-for-grabs',
            full_name: 'up-for-grabs/up-for-grabs.net',
            description: 'This is a list of projects which have curated tasks specifically for new contributors',
            language: 'Various',
            stargazers_count: 4800,
            html_url: 'https://github.com/up-for-grabs/up-for-grabs.net'
          },
          {
            id: 3,
            name: 'contributing-guide',
            full_name: 'github/docs',
            description: 'The open-source repo for docs.github.com - Step-by-step guides for contributing',
            language: 'Various',
            stargazers_count: 14000,
            html_url: 'https://github.com/github/docs'
          }
        );
      }
      setRepos(fallbackRepos);
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
            <p className="mt-4 text-gray-600">Loading repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="bg-glass max-w-4xl mx-auto rounded-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Hackathon & Open Source Guides</h1>

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-2">
              {[
                { key: "hackathon", label: "How to Win Hackathons" },
                { key: "opensource", label: "Open Source Contribution" }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    category === cat.key
                      ? 'bg-blue-600 text-white'
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
                { key: "java", label: "Java" }
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
                { key: "stars", label: "Most Liked" },
                { key: "forks", label: "Most Forks" }
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
          {repos.map((repo, index) => (
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

        {repos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No repositories found for {category}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonOSPage;