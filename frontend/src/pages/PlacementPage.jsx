import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../component/Spinner";
import { saveRepository } from "../lib/function";

const PlacementPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("hexaware");
  const [round, setRound] = useState("aptitude");
  const [sortBy, setSortBy] = useState("stars");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlacementRepos();
  }, [company, round, sortBy]);

  const fetchPlacementRepos = async () => {
    setLoading(true);
    try {
      let query = `${company}`;
      if (round === 'aptitude') {
        query += ' (aptitude OR "quantitative aptitude" OR reasoning OR "logical reasoning")';
      } else if (round === 'technical') {
        query += ' (technical OR programming OR coding OR algorithms)';
      } else if (round === 'interview') {
        query += ' (interview OR "system design" OR hr OR behavioral)';
      } else if (round === 'coding') {
        query += ' (coding OR "coding test" OR "online test" OR leetcode)';
      }

      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sortBy}&order=desc&per_page=20`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Clone-App'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch placement repositories');
      }

      const data = await response.json();
      setRepos(data.items || []);
    } catch (error) {
      console.error('Error fetching placement repos:', error);
      toast.error('Failed to load placement repositories');

      // Fallback data with helpful resources
      const fallbackRepos = [];
      if (round === 'aptitude') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'A-to-Z-Resources-for-Students',
            full_name: 'dipakkr/A-to-Z-Resources-for-Students',
            description: 'Curated list of resources for students including aptitude, programming, and placement materials',
            language: 'Various',
            stargazers_count: 8500,
            html_url: 'https://github.com/dipakkr/A-to-Z-Resources-for-Students'
          },
          {
            id: 2,
            name: 'cs-video-courses',
            full_name: 'Developer-Y/cs-video-courses',
            description: 'List of Computer Science courses with video lectures, including aptitude and reasoning topics',
            language: 'Various',
            stargazers_count: 52000,
            html_url: 'https://github.com/Developer-Y/cs-video-courses'
          },
          {
            id: 3,
            name: 'awesome',
            full_name: 'sindresorhus/awesome',
            description: 'Awesome lists about all kinds of interesting topics including study resources',
            language: 'Various',
            stargazers_count: 250000,
            html_url: 'https://github.com/sindresorhus/awesome'
          },
          {
            id: 4,
            name: 'developer-roadmap',
            full_name: 'kamranahmedse/developer-roadmap',
            description: 'Interactive roadmaps, guides and other educational content to help developers grow',
            language: 'Various',
            stargazers_count: 240000,
            html_url: 'https://github.com/kamranahmedse/developer-roadmap'
          },
          {
            id: 5,
            name: 'free-programming-books',
            full_name: 'EbookFoundation/free-programming-books',
            description: 'Freely available programming books with aptitude and quantitative sections',
            language: 'Various',
            stargazers_count: 280000,
            html_url: 'https://github.com/EbookFoundation/free-programming-books'
          }
        );
      } else if (round === 'technical') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'data-structures-algorithms',
            full_name: 'prep/data-structures-algorithms',
            description: 'Complete DSA implementation with problems and solutions',
            language: 'C++',
            stargazers_count: 2100,
            html_url: 'https://github.com/example/data-structures-algorithms'
          },
          {
            id: 2,
            name: 'system-design',
            full_name: 'prep/system-design',
            description: 'System design concepts and interview questions',
            language: 'Various',
            stargazers_count: 1450,
            html_url: 'https://github.com/example/system-design'
          }
        );
      } else if (round === 'interview') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'behavioral-interview',
            full_name: 'prep/behavioral-interview',
            description: 'Common behavioral interview questions and answers',
            language: 'Various',
            stargazers_count: 780,
            html_url: 'https://github.com/example/behavioral-interview'
          },
          {
            id: 2,
            name: 'hr-questions',
            full_name: 'prep/hr-questions',
            description: 'Frequently asked HR interview questions and tips',
            language: 'Various',
            stargazers_count: 620,
            html_url: 'https://github.com/example/hr-questions'
          }
        );
      } else if (round === 'coding') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'coding-interview-prep',
            full_name: 'prep/coding-interview-prep',
            description: 'Coding interview problems with multiple solutions',
            language: 'JavaScript',
            stargazers_count: 1800,
            html_url: 'https://github.com/example/coding-interview-prep'
          },
          {
            id: 2,
            name: 'leetcode-solutions',
            full_name: 'prep/leetcode-solutions',
            description: 'Solutions to LeetCode problems categorized by difficulty',
            language: 'Python',
            stargazers_count: 3200,
            html_url: 'https://github.com/example/leetcode-solutions'
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
            <p className="mt-4 text-gray-600">Loading placement repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="bg-glass max-w-4xl mx-auto rounded-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Placement Preparation Repositories</h1>

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-2">
              {[
                { key: "hexaware", label: "Hexaware" },
                { key: "capgemini", label: "Capgemini" },
                { key: "cognizant", label: "Cognizant" },
                { key: "tcs", label: "TCS" },
                { key: "infosys", label: "Infosys" }
              ].map(comp => (
                <button
                  key={comp.key}
                  onClick={() => setCompany(comp.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    company === comp.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {comp.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { key: "aptitude", label: "Aptitude" },
                { key: "technical", label: "Technical" },
                { key: "interview", label: "Interview" },
                { key: "coding", label: "Coding" }
              ].map(rnd => (
                <button
                  key={rnd.key}
                  onClick={() => setRound(rnd.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    round === rnd.key
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {rnd.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { key: "popular", sort: "stars", label: "Most Liked" },
                { key: "forks", sort: "forks", label: "Most Forks" }
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
            <p className="text-gray-500">No placement repositories found for {company} {round}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementPage;