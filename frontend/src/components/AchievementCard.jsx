const AchievementCard = ({ achievement, unlocked, progress, progressPercent, requiredValue }) => {
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
      unlocked
        ? `${getRarityColor(achievement.rarity)} shadow-lg`
        : 'bg-gray-50 border-gray-200 opacity-70'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold ${
              unlocked
                ? achievement.rarity === 'legendary' ? 'text-yellow-700' : 'text-gray-800'
                : 'text-gray-500'
            }`}>
              {achievement.name}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              achievement.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
              achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
              achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
              'bg-yellow-200 text-yellow-700'
            }`}>
              {achievement.rarity}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

          {!unlocked ? (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress: {progress}/{requiredValue}</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                ✓ Unlocked
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                +{achievement.points} pts
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;