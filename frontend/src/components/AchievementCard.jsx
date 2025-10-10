import React from 'react';

const AchievementCard = ({ achievement }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
      achievement.unlocked
        ? 'border-yellow-400/50 bg-gradient-to-br from-yellow-400/20 to-orange-500/20'
        : 'border-gray-600/50 bg-gray-800/50'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
          {achievement.icon || '🏆'}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.name}
          </h3>
          <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
              {achievement.unlocked ? '✅ Unlocked' : '🔒 Locked'}
            </div>
            {achievement.points && (
              <div className={`text-sm font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                ⭐ {achievement.points} pts
              </div>
            )}
          </div>
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="text-xs text-gray-400 mt-2">
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;