import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from "recharts";

// Custom hook for analytics data fetching
const useAnalytics = (owner, repo) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (refresh = false) => {
    // Don't fetch if owner/repo are empty
    if (!owner || !repo) {
      return;
    }

    const loadingToast = toast.loading(
      refresh
        ? `Refreshing analytics for ${owner}/${repo}...`
        : `Fetching analytics for ${owner}/${repo}...`,
      { duration: 3000 }
    );

    try {
      setLoading(true);
      setError(null);

      const url = refresh
        ? `/api/analytics/${owner}/${repo}?refresh=true`
        : `/api/analytics/${owner}/${repo}`;

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to fetch analytics (${res.status})`);
      }

      const data = await res.json();
      console.log('Analytics API response:', data);

      if (!data.success) {
        throw new Error(data.error || "Analytics data not available");
      }

      // Normalize data structure
      const normalizedAnalytics = {
        ...data,
        fromCache: data.source === "cache",
        data: {
          contributors: data.contributors || [],
          commitActivity: data.commitActivity || [],
        },
        codeFrequency: data.codeFrequency || [],
        warnings: data.warnings || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };

      setAnalytics(normalizedAnalytics);

      toast.success(`Analytics loaded ${normalizedAnalytics.fromCache ? "(cached)" : ""}`, {
        id: loadingToast,
        duration: 2000,
      });

      return normalizedAnalytics;
    } catch (error) {
      console.error("Analytics fetch error:", error);
      const errorMessage = error.message || "Something went wrong while fetching analytics";

      setError(errorMessage);

      toast.error(
        (t) => (
          <div className="flex flex-col gap-2">
            <span>{errorMessage}</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                fetchAnalytics();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ),
        { id: loadingToast, duration: 5000 }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, [owner, repo]);

  return { analytics, loading, error, fetchAnalytics };
};

// Chart components for better organization
const CodeFrequencyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Code Changes</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-400">No code change data available</p>
          <p className="text-sm text-gray-500 mt-2">Repository may not have recent activity</p>
        </div>
      </div>
    );
  }

  const chartData = data.slice(-20).map((freq, index) => ({
    id: index,
    week: `W${index + 1}`,
    date: new Date(freq[0] * 1000).toLocaleDateString(),
    additions: freq[1],
    deletions: Math.abs(freq[2])
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">📝 Code Changes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="additionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="deletionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="week"
            stroke="#9CA3AF"
            label={{ value: 'Weeks', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            formatter={(value, name) => [
              value,
              name === 'additions' ? 'Additions' : 'Deletions'
            ]}
            labelFormatter={(label, items) => {
              const item = items[0];
              return item ? `Date: ${item.payload.date}` : `Week: ${label}`;
            }}
          />
          <Legend />
          <Bar
            dataKey="additions"
            name="Lines Added"
            fill="url(#additionsGradient)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="deletions"
            name="Lines Deleted"
            fill="url(#deletionsGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">Green bars show added lines, red bars show deleted lines</p>
    </div>
  );
};

const CommitTimelineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📈 Commit Timeline</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-400">No commit timeline data available</p>
          <p className="text-sm text-gray-500 mt-2">Repository may not have recent activity</p>
        </div>
      </div>
    );
  }

  const chartData = data.slice(-20).map((activity, index) => ({
    id: index,
    week: `W${index + 1}`,
    date: new Date(activity.week * 1000).toLocaleDateString(),
    commits: activity.total
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">📈 Commit Timeline</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="week"
            stroke="#9CA3AF"
            label={{ value: 'Weeks', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value} commits`, 'Commits']}
            labelFormatter={(label, items) => {
              const item = items[0];
              return item ? `Date: ${item.payload.date}` : `Week: ${label}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="url(#commitsGradient)"
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">Shows commit activity over the last 20 weeks</p>
    </div>
  );
};

const ContributorsChart = ({ contributors }) => {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">👥 Top Contributors</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👤</div>
          <p className="text-gray-400">No contributor data available</p>
        </div>
      </div>
    );
  }

  const chartData = contributors.slice(0, 10).map(contributor => ({
    ...contributor,
    author: contributor.author?.login || contributor.author || 'Unknown',
    shortName: (contributor.author?.login || contributor.author || 'Unknown').substring(0, 15)
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">👥 Top Contributors</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="contributorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="shortName"
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value} commits`, 'Commits']}
            labelFormatter={(label, items) => {
              const item = items[0];
              return item ? `Contributor: ${item.payload.author}` : label;
            }}
          />
          <Bar
            dataKey="commits"
            name="Commits"
            fill="url(#contributorsGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const KPISummary = ({ analytics }) => {
  const totalCommits = analytics.data.contributors.reduce((sum, contributor) => sum + contributor.commits, 0);
  const totalAdditions = (analytics.codeFrequency || []).reduce((sum, freq) => sum + freq[1], 0);
  const totalDeletions = (analytics.codeFrequency || []).reduce((sum, freq) => sum + freq[2], 0);

  const kpis = [
    {
      label: "Total Contributors",
      value: analytics.data.contributors.length,
      color: "text-blue-400"
    },
    {
      label: "Total Commits",
      value: totalCommits,
      color: "text-green-400"
    },
    {
      label: "Lines Added",
      value: totalAdditions,
      color: "text-purple-400"
    },
    {
      label: "Lines Deleted",
      value: totalDeletions,
      color: "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors">
          <div className={`text-2xl font-bold ${kpi.color}`}>
            {kpi.value.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm mt-1">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
};

const AnalyticsDashboard = () => {
  const { owner: urlOwner, repo: urlRepo } = useParams();
  const { authUser } = useAuthContext();
  const [owner, setOwner] = useState(urlOwner || '');
  const [repo, setRepo] = useState(urlRepo || '');
  const [userRepos, setUserRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const { analytics, loading, error, fetchAnalytics } = useAnalytics(owner, repo);

  // Fetch user's repositories
  const fetchUserRepos = async () => {
    if (!authUser?.username) return;

    setReposLoading(true);
    try {
      const response = await fetch(`/api/users/profile/${authUser.username}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.repos) {
        // Show only first 6 repositories for the analytics page
        setUserRepos(data.repos.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching user repos:', error);
    } finally {
      setReposLoading(false);
    }
  };

  useEffect(() => {
    if (urlOwner && urlRepo) {
      setOwner(urlOwner);
      setRepo(urlRepo);
      // Automatically fetch analytics when URL params are provided
      fetchAnalytics();
    }
  }, [urlOwner, urlRepo]); // Remove fetchAnalytics from deps to prevent re-runs

  useEffect(() => {
    if (authUser?.username && !owner && !repo && !urlOwner && !urlRepo) {
      // Fetch user's repositories when on analytics page without params
      fetchUserRepos();
    }
  }, [authUser, owner, repo, urlOwner, urlRepo]);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (owner && repo) {
      fetchAnalytics();
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard
      .writeText(JSON.stringify(analytics, null, 2))
      .then(() => toast.success("JSON copied to clipboard!"))
      .catch(() => toast.error("Failed to copy JSON"));
  };

  const handleRefreshData = async () => {
    try {
      await fetchAnalytics(true);
    } catch (error) {
      // Error handled in fetchAnalytics
    }
  };


  // Show error only when we have owner/repo and there's an actual error
  if (owner && repo && (error || (!analytics && !loading))) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-10">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Unable to Load Analytics</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              {error || "No analytics data available for this repository"}
            </p>
            <button
              onClick={handleRefreshData}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show repository input form if no owner/repo provided
  if (!owner || !repo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Repository Analytics</h1>
            <p className="text-gray-400">Analyze GitHub repository statistics and insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Access to User's Repositories */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
              <p className="text-gray-400 text-sm mb-4">
                Click on any repository below to view its analytics
              </p>

              {reposLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-400 text-sm">Loading your repositories...</p>
                </div>
              ) : userRepos.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userRepos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => {
                        const repoOwner = repo.owner?.login || repo.owner || authUser.username;
                        const repoName = repo.name;

                        if (!repoOwner || !repoName) {
                          toast.error('Repository information is incomplete');
                          return;
                        }

                        setOwner(repoOwner);
                        setRepo(repoName);
                        fetchAnalytics();
                      }}
                      className="p-3 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      <div className="font-medium">{repo.name}</div>
                      <div className="text-sm text-gray-400">
                        {repo.description || 'No description'}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>⭐ {repo.stargazers_count || 0}</span>
                        <span>🍴 {repo.forks_count || 0}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          repo.language ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          {repo.language || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No repositories found</p>
                </div>
              )}
            </div>

            {/* Manual Repository Input */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Analyze Any Repository</h2>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Repository Owner</label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="e.g., facebook"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Repository Name</label>
                  <input
                    type="text"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    placeholder="e.g., react"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!owner || !repo}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Analyze Repository
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Enter any public GitHub repository to view detailed analytics including contributors, commit activity, and code changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Analytics for <span className="text-blue-400">{owner}/{repo}</span>
            </h1>
            {analytics && analytics.fromCache && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>🔄 Cached data</span>
                {analytics.lastUpdated && (
                  <span className="text-gray-400">
                    (Updated: {new Date(analytics.lastUpdated).toLocaleString()})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefreshData}
              disabled={loading}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
            <button
              onClick={handleCopyJSON}
              disabled={!analytics}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
            >
              Copy JSON
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center min-h-64 mb-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">
                Loading analytics for {owner}/{repo}
              </h2>
              <p className="text-gray-400">This may take a moment...</p>
            </div>
          </div>
        )}

        {analytics && !loading && (
          <>
            {/* KPI Summary */}
            <KPISummary analytics={analytics} />

            {/* Warnings */}
            {analytics.warnings && analytics.warnings.length > 0 && (
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Partial Data Available</h3>
                <ul className="list-disc list-inside text-yellow-300 text-sm">
                  {analytics.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <CodeFrequencyChart data={analytics.codeFrequency} />
              <ContributorsChart contributors={analytics.data.contributors} />
            </div>

            {/* Raw JSON Data */}
            <details className="bg-gray-800 rounded-lg">
              <summary className="cursor-pointer p-4 font-semibold text-lg hover:bg-gray-750 transition-colors">
                📋 Raw Analytics Data
              </summary>
              <div className="p-4 border-t border-gray-700">
                <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm max-h-96">
                  {JSON.stringify(analytics, null, 2)}
                </pre>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
