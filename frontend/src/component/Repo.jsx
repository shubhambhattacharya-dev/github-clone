import toast from "react-hot-toast";
import { saveRepository, removeSavedRepo, starRepository, unstarRepository } from "../lib/function";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

const Repo = memo(({ repo, showSaveButton = true }) => {
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await saveRepository(repo);
      toast.success('Repository saved!');
    } catch (error) {
      toast.error(error.message || 'Failed to save repository');
    }
  };

  const handleUnsave = async () => {
    try {
      await removeSavedRepo(repo.id);
      toast.success('Repository removed from saved!');
    } catch (error) {
      toast.error(error.message || 'Failed to remove repository');
    }
  };

  const handleStar = async () => {
    try {
      await starRepository(repo);
      toast.success('Repository starred!');
    } catch (error) {
      toast.error(error.message || 'Failed to star repository');
    }
  };

  const handleUnstar = async () => {
    try {
      await unstarRepository(repo.full_name || `${repo.owner?.login}/${repo.name}`);
      toast.success('Repository unstarred!');
    } catch (error) {
      toast.error(error.message || 'Failed to unstar repository');
    }
  };

  const handleAnalytics = () => {
    const owner = repo.owner?.login || repo.owner;
    const repoName = repo.name;

    if (!owner || !repoName) {
      toast.error('Repository information is incomplete');
      return;
    }

    navigate(`/analytics/${owner}/${repoName}`);
    toast.success('Loading analytics...');
  };
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              {repo.name}
            </a>
          </h3>
          <p className="text-gray-300 mb-4">{repo.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span>{repo.language || 'Unknown'}</span>
            </span>
            <span>⭐ {repo.stargazers_count || 0}</span>
            <span>🍴 {repo.forks_count || 0}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(`git clone ${repo.clone_url || repo.html_url}`);
                toast.success('Clone URL copied to clipboard!');
              }}
            >
              Clone
            </button>
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              onClick={handleAnalytics}
            >
              Analytics
            </button>
            {showSaveButton && (
              <>
                <button
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                  onClick={handleStar}
                >
                  ⭐ Star
                </button>
              </>
            )}
          </div>
        </div>

        <div className="ml-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            repo.private ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {repo.private ? 'Private' : 'Public'}
          </span>
        </div>
      </div>
    </div>
  );
});

Repo.displayName = 'Repo';

export default Repo;