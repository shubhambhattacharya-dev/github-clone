import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AchievementToast = ({ achievements }) => {
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      achievements.forEach(achievement => {
        toast.success(
          <div className="flex items-center gap-3">
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <div className="font-bold">🏆 Achievement Unlocked!</div>
              <div>{achievement.name}</div>
              <div className="text-sm text-gray-600">{achievement.description}</div>
            </div>
          </div>,
          {
            duration: 6000,
            position: 'top-right',
            style: {
              background: '#f0f9ff',
              border: '2px solid #7dd3fc',
            },
          }
        );
      });
    }
  }, [achievements]);

  return null;
};

export default AchievementToast;