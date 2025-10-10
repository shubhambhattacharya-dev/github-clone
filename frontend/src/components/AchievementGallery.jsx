import { useEffect, useState } from 'react';
import AchievementCard from './AchievementCard';
import AchievementToast from './AchievementToast';

const AchievementGallery = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ totalUnlocked: 0, totalPoints: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUnlocks, setNewUnlocks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [checking, setChecking] = useState(false);

  // Function to fetch achievements from the backend
  const fetchAchievements = async () => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔍 Fetching achievements from /api/achievements...');

      const res = await fetch('/api/achievements', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));

      // Check if the response is OK (status 200-299)
      if (!res.ok) {
        // Try to get response text for debugging
        const responseText = await res.text();
        console.error('❌ Server error response:', responseText.substring(0, 500));

        if (res.status === 401) {
          throw new Error('Please log in to view achievements');
        } else if (res.status === 404) {
          throw new Error('Achievements endpoint not found');
        } else {
          throw new Error(`Server error: ${res.status} - ${res.statusText}`);
        }
      }

      // Check content type
      const contentType = res.headers.get('content-type');
      console.log('📄 Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await res.text();
        console.error('❌ Received non-JSON response:', responseText.substring(0, 500));
        throw new Error('Server returned HTML instead of JSON. Check if /api/achievements route exists.');
      }

      const data = await res.json();
      console.log('✅ Parsed JSON data:', data);

      if (data.success) {
        setAchievements(data.achievements || []);
        setStats(data.stats || { totalUnlocked: 0, totalPoints: 0, completionPercentage: 0 });
        // Check for newly unlocked achievements for toasts
        const unlocked = (data.achievements || []).filter(a => a.unlocked && !a.previouslyUnlocked);
        if (unlocked.length > 0) setNewUnlocks(unlocked);
      } else {
        throw new Error(data.error || 'Failed to load achievements');
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to check for new achievements
  const checkForNewAchievements = async () => {
    try {
      setChecking(true);
      setError(null);

      console.log('🔍 Checking for new achievements at /api/achievements/check...');

      const res = await fetch('/api/achievements/check', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Check response status:', res.status);

      if (!res.ok) {
        const responseText = await res.text();
        console.error('❌ Check server error response:', responseText.substring(0, 500));

        if (res.status === 401) {
          throw new Error('Please log in to check achievements');
        } else if (res.status === 404) {
          throw new Error('Achievement check endpoint not found');
        } else {
          throw new Error(`Server error: ${res.status} - ${res.statusText}`);
        }
      }

      // Check content type
      const contentType = res.headers.get('content-type');
      console.log('📄 Check Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await res.text();
        console.error('❌ Check received non-JSON response:', responseText.substring(0, 500));
        throw new Error('Server returned HTML instead of JSON for achievement check.');
      }

      const data = await res.json();
      console.log('✅ Check parsed JSON data:', data);

      if (data.success) {
        // Refresh achievements list
        await fetchAchievements();
        // Show success message
        if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
          setNewUnlocks(data.newlyUnlocked);
        }
      } else {
        throw new Error(data.error || 'Failed to check achievements');
      }
    } catch (error) {
      console.error('❌ Check achievements error:', error);
      setError(error.message);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Filter achievements based on active filter
  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unlocked') return achievement.unlocked;
    if (activeFilter === 'locked') return !achievement.unlocked;
    return achievement.category === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-xl text-white font-semibold">Loading your achievements...</div>
          <div className="text-purple-300 mt-2">Unlocking your progress</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Error Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" role="alert">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <h3 className="text-red-800 font-semibold">Something went wrong</h3>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={fetchAchievements}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto p-6">
        {/* Achievement Toasts */}
        {newUnlocks.map((achievement, index) => (
          <AchievementToast
            key={achievement.id}
            achievement={achievement}
            onClose={() => {
              setNewUnlocks(prev => prev.filter(a => a.id !== achievement.id));
            }}
            delay={index * 1000} // Stagger toasts
          />
        ))}

        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl">
            <span className="text-6xl">🏆</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Achievements
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
            Track your progress, unlock rewards, and showcase your GitHub journey! 🌟
          </p>
        </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{stats.totalUnlocked}</div>
              <div className="text-white/70 text-sm">Achievements Unlocked</div>
            </div>
            <div className="text-5xl opacity-80">🏆</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{stats.totalPoints}</div>
              <div className="text-white/70 text-sm">Total Points</div>
            </div>
            <div className="text-5xl opacity-80">⭐</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">
                {achievements.length > 0 ? Math.round((stats.totalUnlocked / achievements.length) * 100) : 0}%
              </div>
              <div className="text-white/70 text-sm">Completion Rate</div>
            </div>
            <div className="text-5xl opacity-80">📊</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Filter Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All', icon: '📚' },
                { key: 'unlocked', label: 'Unlocked', icon: '✅' },
                { key: 'locked', label: 'Locked', icon: '🔒' },
                { key: 'social', label: 'Social', icon: '👥' },
                { key: 'productivity', label: 'Productivity', icon: '⚡' },
                { key: 'exploration', label: 'Exploration', icon: '🗺️' },
                { key: 'special', label: 'Special', icon: '✨' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                  }`}
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={checkForNewAchievements}
              disabled={checking}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              {checking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Checking...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Check for New
                </>
              )}
            </button>

            {/* Test API Button - Hidden in production */}
            <button
              onClick={async () => {
                try {
                  console.log('🧪 Testing API endpoint...');
                  const res = await fetch('/api/achievements/test', {
                    headers: { 'Content-Type': 'application/json' }
                  });
                  const data = await res.json();
                  console.log('🧪 Test result:', data);
                  alert('API Test: ' + JSON.stringify(data, null, 2));
                } catch (error) {
                  console.error('🧪 Test failed:', error);
                  alert('API Test Failed: ' + error.message);
                }
              }}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
            >
              <span>🧪</span>
              Test API
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="text-8xl opacity-20 mb-4">🏆</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">🎯</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {activeFilter === 'all' ? 'Ready to Start Your Journey?' : 'No Achievements Found'}
          </h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto mb-6">
            {activeFilter === 'all'
              ? "Begin exploring GitHub and unlock your first achievement! Every action brings you closer to mastery."
              : `No ${activeFilter} achievements match your current filter. Try a different category!`
            }
          </p>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Show All Achievements
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AchievementCard
                achievement={achievement}
              />
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default AchievementGallery;