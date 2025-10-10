import Achievement from "../models/achievement.model.js";
import User from "../models/user.model.js";

// Get user achievements with progress
export const getUserAchievements = async (req, res) => {
  try {
    // Set Content-Type header explicitly
    res.setHeader('Content-Type', 'application/json');

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Get all active achievements
    const allAchievements = await Achievement.find({ isActive: true });

    // Calculate progress for each achievement
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userAchievement = user.achievements?.find(
        ua => ua.achievementId === achievement.id
      );

      let progress = 0;
      let requiredValue = achievement.requirements.value;
      let progressPercent = 0;
      let unlocked = !!userAchievement;
      let unlockedAt = userAchievement?.unlockedAt;

      // Calculate progress based on requirement type
      switch (achievement.requirements.type) {
        case 'login_count':
          progress = user.loginCount || 0;
          break;
        case 'repos_saved':
          progress = user.savedRepos?.length || 0;
          break;
        case 'likes_given':
          // Count how many profiles this user has liked
          progress = 0; // This would need a separate query
          break;
        case 'likes_received':
          progress = user.likes?.length || 0;
          break;
        case 'stars_earned':
          // Calculate total stars from saved repos
          progress = user.savedRepos?.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) || 0;
          break;
        case 'puzzles_completed':
          // This will be tracked separately and updated when puzzles are completed
          progress = user.achievementStats?.puzzlesCompleted || 0;
          break;
        default:
          progress = 0;
      }

      // Calculate percentage
      if (requiredValue > 0) {
        progressPercent = Math.min(Math.round((progress / requiredValue) * 100), 100);
      }

      // Check if achievement should be unlocked
      if (!unlocked && progress >= requiredValue) {
        unlocked = true;
        unlockedAt = new Date();
        // Add to user's achievements (this would be done in a separate function)
      }

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        points: achievement.points,
        category: achievement.category,
        unlocked,
        unlockedAt,
        progress,
        requiredValue,
        progressPercent
      };
    });

    // Calculate stats
    const unlockedAchievements = achievementsWithProgress.filter(a => a.unlocked);
    const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
    const completionPercentage = allAchievements.length > 0
      ? Math.round((unlockedAchievements.length / allAchievements.length) * 100)
      : 0;

    const stats = {
      totalUnlocked: unlockedAchievements.length,
      totalPoints,
      completionPercentage
    };

    res.json({
      success: true,
      achievements: achievementsWithProgress,
      stats
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      error: "Failed to load achievements"
    });
  }
};

// Check and award achievements (server-side validation)
export const checkAchievements = async (req, res) => {
  try {
    // Set Content-Type header explicitly
    res.setHeader('Content-Type', 'application/json');

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const allAchievements = await Achievement.find({ isActive: true });
    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      const alreadyUnlocked = user.achievements?.some(
        ua => ua.achievementId === achievement.id
      );

      if (alreadyUnlocked) continue;

      // Check if user meets requirements
      let meetsRequirement = false;

      switch (achievement.requirements.type) {
        case 'login_count':
          meetsRequirement = (user.loginCount || 0) >= achievement.requirements.value;
          break;
        case 'repos_saved':
          meetsRequirement = (user.savedRepos?.length || 0) >= achievement.requirements.value;
          break;
        case 'likes_received':
          meetsRequirement = (user.likes?.length || 0) >= achievement.requirements.value;
          break;
        case 'stars_earned':
          const totalStars = user.savedRepos?.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) || 0;
          meetsRequirement = totalStars >= achievement.requirements.value;
          break;
        case 'puzzles_completed':
          meetsRequirement = (user.achievementStats?.puzzlesCompleted || 0) >= achievement.requirements.value;
          break;
        // Add more requirement types as needed
      }

      if (meetsRequirement) {
        user.achievements = user.achievements || [];
        user.achievements.push({
          achievementId: achievement.id,
          unlockedAt: new Date()
        });

        user.totalPoints = (user.totalPoints || 0) + achievement.points;
        newlyUnlocked.push({
          id: achievement.id,
          name: achievement.name,
          icon: achievement.icon,
          description: achievement.description,
          points: achievement.points
        });
      }
    }

    if (newlyUnlocked.length > 0) {
      await user.save();
    }

    res.json({
      success: true,
      newlyUnlocked,
      message: newlyUnlocked.length > 0
        ? `Unlocked ${newlyUnlocked.length} new achievement${newlyUnlocked.length > 1 ? 's' : ''}!`
        : "No new achievements unlocked"
    });

  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      error: "Failed to check achievements"
    });
  }
};