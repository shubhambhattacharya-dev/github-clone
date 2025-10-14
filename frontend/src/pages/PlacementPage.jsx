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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlacementRepos();
  }, [company, round, sortBy]);

  const fetchPlacementRepos = async () => {
    setLoading(true);
    try {
      let query = 'stars:>1';
      if (searchQuery.trim()) {
        query += ` ${searchQuery}`;
      } else {
        query += ` ${company}`;
        if (round === 'aptitude') {
          query += ' (aptitude OR "quantitative aptitude" OR reasoning OR "logical reasoning")';
        } else if (round === 'technical') {
          query += ' (technical OR programming OR coding OR algorithms)';
        } else if (round === 'interview') {
          query += ' (interview OR "system design" OR hr OR behavioral)';
        } else if (round === 'coding') {
          query += ' (coding OR "coding test" OR "online test" OR leetcode)';
        } else if (round === 'internship') {
          query += ' (internship OR "internship guide" OR "internship roadmap" OR "internship application" OR linkedin OR intershala)';
        } else if (round === 'offers') {
          query += ' (internship offers OR "new internships" OR "internship opportunities" OR "internship openings")';
        }
      }

      let apiUrl;
      if (sortBy === 'best') {
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
        throw new Error('Failed to fetch placement repositories');
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
      setRepos(repos.slice(0, 20));
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
      } else if (round === 'internship') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'internship-guide',
            full_name: 'internship-resources/internship-guide',
            description: 'Complete guide to finding and applying for internships - LinkedIn, Intershala, Naukri tips',
            language: 'Various',
            stargazers_count: 4500,
            html_url: 'https://github.com/example/internship-guide'
          },
          {
            id: 2,
            name: 'internship-roadmap',
            full_name: 'career-roadmaps/internship-roadmap',
            description: 'Step-by-step roadmap for internship preparation and application process',
            language: 'Various',
            stargazers_count: 3200,
            html_url: 'https://github.com/example/internship-roadmap'
          },
          {
            id: 3,
            name: 'linkedin-optimization',
            full_name: 'job-search/linkedin-optimization',
            description: 'How to optimize LinkedIn profile for internship applications and networking',
            language: 'Various',
            stargazers_count: 2800,
            html_url: 'https://github.com/example/linkedin-optimization'
          },
          {
            id: 4,
            name: 'intershala-guide',
            full_name: 'placement-guides/intershala-guide',
            description: 'Complete guide to using Intershala for internship applications and success tips',
            language: 'Various',
            stargazers_count: 1900,
            html_url: 'https://github.com/example/intershala-guide'
          },
          {
            id: 5,
            name: 'internship-interview-prep',
            full_name: 'interview-prep/internship-interview-prep',
            description: 'Common internship interview questions and preparation strategies',
            language: 'Various',
            stargazers_count: 2100,
            html_url: 'https://github.com/example/internship-interview-prep'
          }
        );
      } else if (round === 'offers') {
        fallbackRepos.push(
          {
            id: 1,
            name: 'internship-opportunities',
            full_name: 'job-board/internship-opportunities',
            description: 'Latest internship opportunities and job openings from top companies',
            language: 'Various',
            stargazers_count: 3800,
            html_url: 'https://github.com/example/internship-opportunities'
          },
          {
            id: 2,
            name: 'new-internships-2024',
            full_name: 'career-updates/new-internships-2024',
            description: 'New internship offers and openings for 2024 - updated regularly',
            language: 'Various',
            stargazers_count: 2900,
            html_url: 'https://github.com/example/new-internships-2024'
          },
          {
            id: 3,
            name: 'summer-internships',
            full_name: 'seasonal-jobs/summer-internships',
            description: 'Summer internship programs and application deadlines',
            language: 'Various',
            stargazers_count: 2400,
            html_url: 'https://github.com/example/summer-internships'
          },
          {
            id: 4,
            name: 'tech-internships',
            full_name: 'tech-careers/tech-internships',
            description: 'Technology-focused internship opportunities and requirements',
            language: 'Various',
            stargazers_count: 3100,
            html_url: 'https://github.com/example/tech-internships'
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
          <h1 className="text-2xl font-bold mb-4">Placement & Internship Preparation</h1>

          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search internship/placement resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => fetchPlacementRepos()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

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
                { key: "coding", label: "Coding" },
                { key: "internship", label: "Internship" },
                { key: "offers", label: "New Offers" }
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