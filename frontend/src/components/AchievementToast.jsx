import React, { useEffect, useState } from 'react';

const AchievementToast = ({ achievement, onClose, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, delay);

    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, delay + 5000); // Auto close after 5 seconds

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [delay]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!visible && !closing) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      visible && !closing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-yellow-300">
        <div className="flex items-start gap-3">
          <div className="text-3xl animate-bounce">
            {achievement.icon || '🏆'}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">Achievement Unlocked!</h4>
            <h5 className="font-semibold text-yellow-100 mb-2">{achievement.name}</h5>
            <p className="text-sm text-yellow-50 mb-3">{achievement.description}</p>
            {achievement.points && (
              <div className="text-sm font-bold text-yellow-200">
                ⭐ +{achievement.points} points earned!
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-yellow-200 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="mt-3 bg-yellow-300/20 rounded-full h-1">
          <div className="bg-yellow-300 h-1 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;