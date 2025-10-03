import { useEffect, useState } from "react";
import AchievementCard from "./AchievementCard";

const AchievementGallery = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ totalUnlocked: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements", {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();

      if (data.success) {
        setAchievements(data.achievements);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const filteredAchievements = activeFilter === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeFilter);

  const categories = ['all', 'social', 'exploration', 'productivity', 'special'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Achievement Gallery</h1>
        <div className="flex justify-center gap-6 text-lg">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            📊 Total Points: <strong>{stats.totalPoints || 0}</strong>
          </span>
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            🏆 Unlocked: <strong>{stats.totalUnlocked || 0}</strong>/{achievements.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
              activeFilter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All Achievements' : category}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{unlockedAchievements.length}/{achievements.length} ({Math.round((unlockedAchievements.length / achievements.length) * 100)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={achievement.unlocked}
            progress={achievement.progress}
            progressPercent={achievement.progressPercent}
            requiredValue={achievement.requiredValue}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No achievements found for this category.
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;