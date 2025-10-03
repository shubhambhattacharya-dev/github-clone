import { useState, useEffect } from "react";
import { FaSearch, FaCode, FaUser, FaCalendarAlt, FaTag, FaExternalLinkAlt, FaFilter } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";

const HackathonFinderPage = () => {
  const { authUser } = useAuthContext();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: 'javascript',
    page: 1,
    per_page: 12
  });
  const [pagination, setPagination] = useState(null);

  const languages = [
    'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
    'php', 'ruby', 'go', 'rust', 'typescript', 'swift', 'kotlin'
  ];

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    if (authUser) {
      fetchHackathons();
    }
  }, [filters, authUser]);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        language: filters.language,
        page: filters.page,
        per_page: filters.per_page
      });

      const response = await fetch(`/api/hackathons?${queryParams}`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setHackathons(data.data.hackathons);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch hackathons');
      }
    } catch (error) {
      console.error("Failed to fetch hackathons:", error);
      setError(error.message);

      // Mock data for demonstration
      setHackathons(generateMockHackathons());
      setPagination({
        page: 1,
        per_page: 12,
        has_more: false,
        total_found: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockHackathons = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Sample Hackathon Issue ${i + 1}`,
      url: `https://github.com/sample/repo${i + 1}/issues/${i + 1}`,
      repository: {
        name: `awesome-project-${i + 1}`,
        full_name: `organization/awesome-project-${i + 1}`,
        url: `https://github.com/organization/awesome-project-${i + 1}`
      },
      user: {
        login: `developer${i + 1}`,
        avatar_url: `https://avatars.githubusercontent.com/u/${100000 + i}`
      },
      labels: [
        { name: 'good first issue', color: '5319e7' },
        { name: 'help wanted', color: 'd73a49' },
        { name: filters.language, color: '0e8a16' }
      ],
      state: 'open',
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      comments: Math.floor(Math.random() * 10),
      difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1 // Reset to page 1 when changing filters
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaCode className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Authentication Required</h2>
          <p className="text-gray-500">Please login to find hackathon opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">🎯 Mini Hackathon Finder</h1>
        <p className="text-gray-600 dark:text-gray-300">Discover beginner-friendly issues perfect for hackathons and learning</p>
      </div>

      {/* Filters */}
      <div className="bg-glass p-6 rounded-lg mb-8">
        <div className="flex items-center gap-4 mb-4">
          <FaFilter className="text-xl text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Programming Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang} value={lang} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Results per page</label>
            <select
              value={filters.per_page}
              onChange={(e) => handleFilterChange('per_page', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="6" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">6</option>
              <option value="12" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">12</option>
              <option value="24" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">24</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchHackathons}
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch /> Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-semibold">⚠️ Error:</span>
            <span className="text-red-700">{error}</span>
            <span className="text-sm text-gray-600 ml-auto">Showing demo data</span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? 'Searching...' : `Found ${hackathons.length} opportunities`}
            {pagination && ` (Page ${pagination.page})`}
          </h2>
          {pagination && pagination.has_more && (
            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {/* Hackathon Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-glass p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <div key={hackathon.id} className="bg-glass p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {hackathon.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaUser className="text-gray-400" />
                    <span>{hackathon.user.login}</span>
                    <span>•</span>
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{formatDate(hackathon.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <FaCode className="text-gray-400" />
                    <a
                      href={hackathon.repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {hackathon.repository.full_name}
                    </a>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[hackathon.difficulty]}`}>
                  {hackathon.difficulty}
                </span>
              </div>

              {/* Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hackathon.labels.slice(0, 3).map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}
                  >
                    <FaTag className="text-xs" />
                    {label.name}
                  </span>
                ))}
                {hackathon.labels.length > 3 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{hackathon.labels.length - 3} more
                  </span>
                )}
              </div>

              {/* Comments */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  💬 {hackathon.comments} comments
                </span>
                <a
                  href={hackathon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaExternalLinkAlt className="text-sm" />
                  View Issue
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hackathons.length === 0 && (
        <div className="text-center py-12">
          <FaCode className="mx-auto text-6xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No hackathon opportunities found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later</p>
        </div>
      )}
    </div>
  );
};

export default HackathonFinderPage;