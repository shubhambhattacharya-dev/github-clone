import Achievement from "../models/achievement.model.js";
import User from "../models/user.model.js";

// Predefined achievements
const ACHIEVEMENTS = [
  {
    id: "first_login",
    name: "Welcome Aboard!",
    description: "Logged in for the first time",
    icon: "🎉",
    category: "special",
    rarity: "common",
    requirements: { type: "login_count", value: 1, condition: "gte" },
    points: 5
  },
  {
    id: "repo_collector",
    name: "Repository Collector",
    description: "Saved 5 repositories",
    icon: "📚",
    category: "exploration",
    rarity: "common",
    requirements: { type: "repos_saved", value: 5, condition: "gte" },
    points: 15
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Liked 10 profiles",
    icon: "🦋",
    category: "social",
    rarity: "rare",
    requirements: { type: "likes_given", value: 10, condition: "gte" },
    points: 25
  },
  {
    id: "popular_user",
    name: "Popular User",
    description: "Received 5 likes on your profile",
    icon: "⭐",
    category: "social",
    rarity: "rare",
    requirements: { type: "likes_received", value: 5, condition: "gte" },
    points: 30
  },
  {
    id: "star_collector",
    name: "Star Collector",
    description: "Saved repositories with 100+ total stars",
    icon: "🌟",
    category: "exploration",
    rarity: "epic",
    requirements: { type: "stars_earned", value: 100, condition: "gte" },
    points: 50
  }
];

// Initialize achievements in database
export const initializeAchievements = async () => {
  try {
    console.log("Initializing achievements...");
    for (const ach of ACHIEVEMENTS) {
      await Achievement.findOneAndUpdate(
        { id: ach.id },
        ach,
        { upsert: true, new: true }
      );
    }
    console.log("Achievements initialized successfully!");
  } catch (error) {
    console.error("Error initializing achievements:", error);
  }
};

// Check and award achievements
export const checkAndAwardAchievements = async (userId, actionType) => {
  // For 'check_all' action, check all achievement types
  if (actionType === 'check_all') {
    const user = await User.findById(userId);
    if (!user) return [];

    const unlockedAchievements = [];
    const allAchievements = await Achievement.find({ isActive: true });

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (user.achievements.some(a => a.achievementId === achievement.id)) continue;

      let qualifies = false;
      const req = achievement.requirements;

      // Check all types of achievements
      switch (req.type) {
        case "login_count":
          qualifies = (user.loginCount || 0) >= req.value;
          break;
        case "repos_saved":
          qualifies = user.savedRepos.length >= req.value;
          break;
        case "likes_given":
          qualifies = user.likes?.length >= req.value || false;
          break;
        case "likes_received":
          qualifies = user.likedBy?.length >= req.value || false;
          break;
        case "stars_earned":
          const totalStars = user.savedRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
          qualifies = totalStars >= req.value;
          break;
        default:
          qualifies = false;
      }

      if (qualifies) {
        user.achievements.push({
          achievementId: achievement.id,
          unlockedAt: new Date()
        });
        user.totalPoints += achievement.points;
        user.achievementStats.totalUnlocked += 1;

        unlockedAchievements.push(achievement);
        console.log(`Awarded achievement: ${achievement.name} to user ${userId}`);
      }
    }

    if (unlockedAchievements.length > 0) {
      await user.save();
    }

    return unlockedAchievements;
  }

  // Original logic for specific action types
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const unlockedAchievements = [];
    const allAchievements = await Achievement.find({ isActive: true });

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (user.achievements.some(a => a.achievementId === achievement.id)) continue;

      let qualifies = false;
      const req = achievement.requirements;

      switch (req.type) {
        case "login_count":
          qualifies = user.loginCount >= req.value;
          break;
        case "repos_saved":
          qualifies = user.savedRepos.length >= req.value;
          break;
        case "likes_given":
          qualifies = user.likes.length >= req.value; // Assuming likes is the array of liked users
          break;
        case "likes_received":
          qualifies = user.likes.length >= req.value; // This might need adjustment based on your like system
          break;
        case "stars_earned":
          const totalStars = user.savedRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
          qualifies = totalStars >= req.value;
          break;
        default:
          qualifies = false;
      }

      if (qualifies) {
        user.achievements.push({
          achievementId: achievement.id,
          unlockedAt: new Date()
        });
        user.totalPoints += achievement.points;
        user.achievementStats.totalUnlocked += 1;

        unlockedAchievements.push(achievement);
        console.log(`Awarded achievement: ${achievement.name} to user ${userId}`);
      }
    }

    if (unlockedAchievements.length > 0) {
      await user.save();
    }

    return unlockedAchievements;
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
};

// Check and award all achievements for a user (useful for retroactive checking)
export const checkAllUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const unlockedAchievements = await checkAndAwardAchievements(user._id, 'check_all');

    res.json({
      success: true,
      message: `${unlockedAchievements.length} achievements checked/awarded`,
      unlockedAchievements: unlockedAchievements.map(a => ({
        name: a.name,
        icon: a.icon,
        description: a.description
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user achievements with progress
export const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const allAchievements = await Achievement.find({ isActive: true });

    const achievementsWithProgress = allAchievements.map(ach => {
      const userAch = user.achievements.find(a => a.achievementId === ach.id);

      if (userAch) {
        return {
          ...ach.toObject(),
          unlocked: true,
          unlockedAt: userAch.unlockedAt
        };
      } else {
        let currentProgress = 0;
        const req = ach.requirements;

        switch (req.type) {
          case "repos_saved":
            currentProgress = user.savedRepos?.length || 0;
            break;
          case "likes_given":
            currentProgress = user.likes?.length || 0;
            break;
          case "likes_received":
            currentProgress = user.likes?.length || 0; // Adjust based on your system
            break;
          case "login_count":
            currentProgress = user.loginCount || 0;
            break;
          case "stars_earned":
            currentProgress = user.savedRepos?.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) || 0;
            break;
          default:
            currentProgress = 0;
        }

        return {
          ...ach.toObject(),
          unlocked: false,
          progress: currentProgress,
          progressPercent: Math.min((currentProgress / req.value) * 100, 100),
          requiredValue: req.value
        };
      }
    });

    res.json({
      success: true,
      achievements: achievementsWithProgress,
      stats: user.achievementStats,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};