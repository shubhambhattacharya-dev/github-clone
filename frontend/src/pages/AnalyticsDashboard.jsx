import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const AnalyticsDashboard = () => {
  const { owner, repo } = useParams();
  const { authUser } = useAuthContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchAnalytics = async () => {
      const loadingToast = toast.loading(`Fetching analytics for ${owner}/${repo}...`, {
        duration: 3000,
      });

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/analytics/${owner}/${repo}`, {
          credentials: "include",
          signal: abortController.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Failed to fetch analytics (${res.status})`);
        }

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Analytics data not available");
        }

        if (!isMounted) return;

        // Adjust backend field differences
        const fixedAnalytics = {
          ...data,
          fromCache: data.source === "cache",
          data: {
            contributors: data.contributors || [],
            commitActivity: data.commitActivity || [],
          },
        };

        setAnalytics(fixedAnalytics);

        toast.success(`Analytics loaded ${fixedAnalytics.fromCache ? "(cached)" : ""}`, {
          id: loadingToast,
          duration: 2000,
        });
      } catch (error) {
        if (!isMounted || error.name === "AbortError") return;

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
          {
            id: loadingToast,
            duration: 5000,
          }
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (owner && repo) {
      fetchAnalytics();
    } else {
      setError("Missing repository information");
      setLoading(false);
      toast.error("Invalid repository URL");
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [owner, repo, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">
                Loading analytics for {owner}/{repo}
              </h2>
              <p className="text-gray-400">This may take a moment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
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
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyJSON = () => {
    navigator.clipboard
      .writeText(JSON.stringify(analytics, null, 2))
      .then(() => toast.success("JSON copied to clipboard!"))
      .catch(() => toast.error("Failed to copy JSON"));
  };

  const handleRefreshData = () => {
    toast.promise(
      fetch(`/api/analytics/${owner}/${repo}?refresh=true`, {
        credentials: "include",
      }).then((res) => res.json()),
      {
        loading: "Refreshing analytics data...",
        success: (data) => {
          const fixedAnalytics = {
            ...data,
            fromCache: data.source === "cache",
            data: {
              contributors: data.contributors || [],
              commitActivity: data.commitActivity || [],
            },
          };
          setAnalytics(fixedAnalytics);
          return "Analytics data refreshed!";
        },
        error: "Failed to refresh data",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Analytics for <span className="text-blue-400">{owner}/{repo}</span>
            </h1>
            {analytics.fromCache && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>🔄 Cached data</span>
                {analytics.lastUpdated && (
                  <span className="text-gray-400">
                    (Updated: {new Date(analytics.lastUpdated).toLocaleString()})
                  </span>
                )}
              </div>
            )}
  
            {/* Code Frequency */}
            {(analytics.codeFrequency && analytics.codeFrequency.length > 0) ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">📝 Code Changes</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.codeFrequency.slice(-20).map(freq => ({
                    week: `Week ${new Date(freq[0] * 1000).toLocaleDateString()}`,
                    additions: freq[1],
                    deletions: -freq[2] // Negative for red bars
                  }))}>
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
                    <XAxis dataKey="week" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => [
                        name === 'additions' ? `${value} lines added` : `${Math.abs(value)} lines deleted`,
                        name === 'additions' ? 'Additions' : 'Deletions'
                      ]}
                    />
                    <Bar dataKey="additions" fill="url(#additionsGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="deletions" fill="url(#deletionsGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-400 mt-2">Green bars show added lines, red bars show deleted lines</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">📝 Code Changes</h2>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-400">No code change data available</p>
                  <p className="text-sm text-gray-500 mt-2">Repository may not have recent activity</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefreshData}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
            >
              Refresh Data
            </button>
            <button
              onClick={handleCopyJSON}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Copy JSON
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {analytics.data.contributors.length}
            </div>
            <div className="text-gray-400 text-sm">Total Contributors</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {analytics.data.contributors.reduce((sum, contributor) => sum + contributor.commits, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Commits</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {(analytics.codeFrequency || []).reduce((sum, freq) => sum + freq[1], 0)}
            </div>
            <div className="text-gray-400 text-sm">Lines Added</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {(analytics.codeFrequency || []).reduce((sum, freq) => sum + freq[2], 0)}
            </div>
            <div className="text-gray-400 text-sm">Lines Deleted</div>
          </div>
        </div>

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

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Contributors */}
          {analytics.data.contributors.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">👥 Top Contributors</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.data.contributors.slice(0, 10)}>
                  <defs>
                    <linearGradient id="contributorsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="author" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="commits" fill="url(#contributorsGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Commit Activity */}
          {(analytics.commitActivity && analytics.commitActivity.length > 0) || (analytics.data && analytics.data.commitActivity && analytics.data.commitActivity.length > 0) ? (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Weekly Commits</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(analytics.commitActivity || analytics.data.commitActivity).slice(-12).map(week => ({
                  week: `Week ${new Date(week.week * 1000).toLocaleDateString()}`,
                  commits: week.total
                }))}>
                  <defs>
                    <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(label) => `Date: ${label.replace('Week ', '')}`}
                  />
                  <Bar dataKey="commits" fill="url(#commitsGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-400 mt-2">Shows commits per week for the last 12 weeks</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Weekly Commits</h2>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-400">No commit activity data available</p>
                <p className="text-sm text-gray-500 mt-2">This repository may be new or have private commits</p>
              </div>
            </div>
          )}
        </div>

        {/* Raw JSON Data (Collapsible) */}
        <details className="bg-gray-800 rounded-lg">
          <summary className="cursor-pointer p-4 font-semibold text-lg">📋 Raw Analytics Data</summary>
          <div className="p-4 border-t border-gray-700">
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(analytics, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
