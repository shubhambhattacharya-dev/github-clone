import React, { useEffect, useState } from 'react';
import { fetchSavedRepos, removeSavedRepo } from '../lib/function';
import Repo from '../component/Repo';
import toast, { Toaster } from 'react-hot-toast';

const SavedPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchSavedRepos({ page: 1, limit: 20 });
      
      if (!res.success) {
        throw new Error(res.error || 'Failed to load saved repositories');
      }

      setRepos(res.data || []);
    } catch (err) {
      console.error('Load saved repos error:', err);
      toast.error(err.message || 'Failed to load saved repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (repoId, repoName) => {
    // Enhanced confirmation with repo name
    if (!window.confirm(`Are you sure you want to remove "${repoName}" from saved repositories?`)) {
      return;
    }

    try {
      setRemovingId(repoId);

      // Use toast.promise for better UX
      await toast.promise(
        removeSavedRepo(repoId),
        {
          loading: `Removing ${repoName}...`,
          success: `"${repoName}" removed successfully`,
          error: (err) => `Failed to remove: ${err.message || 'Unknown error'}`
        },
        {
          duration: 3000,
          position: 'top-right',
          success: {
            duration: 4000,
            icon: '🗑️'
          }
        }
      );

      // Optimistic update - remove from state immediately
      setRepos(prev => prev.filter(repo => (repo.full_name || repo.repoId) !== repoId));
      
    } catch (err) {
      console.error('Remove saved repo error:', err);
      // Error toast is handled by toast.promise, but we need to reload on unexpected errors
      if (!err.handledByToast) {
        toast.error('Failed to remove repository. Please try again.');
        await load(); // Reload on unexpected errors
      }
    } finally {
      setRemovingId(null);
    }
  };

  // Custom toast configuration for this component
  const ToastConfig = () => (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'text-sm font-medium',
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
        loading: {
          duration: Infinity, // Will be removed when promise resolves
          iconTheme: {
            primary: '#3B82F6',
            secondary: 'white',
          },
        },
      }}
    />
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ToastConfig />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Saved Repositories</h2>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && repos.length === 0 ? (
        <div className="flex justify-center items-center min-h-32">
          <div className="text-white text-lg">Loading your saved repositories...</div>
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl mb-4">No saved repositories yet</div>
          <button
            onClick={load}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Check Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {repos.map((repo, index) => (
            <div
              key={`${repo.full_name || repo.repoId}-${index}`}
              className="relative bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
            >
              <Repo repo={repo} showSaveButton={false} />
              <button
                onClick={() => handleRemove(repo.full_name || repo.repoId, repo.name || 'Repository')}
                disabled={removingId === (repo.full_name || repo.repoId)}
                className={`absolute right-4 top-4 px-3 py-1 text-sm rounded transition-colors ${
                  removingId === (repo.full_name || repo.repoId)
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {removingId === (repo.full_name || repo.repoId) ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default SavedPage;
