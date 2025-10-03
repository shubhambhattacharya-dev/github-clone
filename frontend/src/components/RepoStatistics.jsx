import { useMemo } from 'react';

const RepoStatistics = ({ repos }) => {
  const stats = useMemo(() => {
    if (!repos || !repos.length) return null;

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const languages = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalRepos: repos.length,
      totalStars,
      totalForks,
      uniqueLanguages: Object.keys(languages).length,
      topLanguage: Object.entries(languages).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
    };
  }, [repos]);

  if (!stats) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-white">📊 Repository Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.totalRepos}</div>
          <div className="text-gray-400 text-sm">Repositories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.totalStars.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Stars</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalForks.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Forks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.uniqueLanguages}</div>
          <div className="text-gray-400 text-sm">Languages</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{stats.topLanguage}</div>
          <div className="text-gray-400 text-sm">Top Language</div>
        </div>
      </div>
    </div>
  );
};

export default RepoStatistics;