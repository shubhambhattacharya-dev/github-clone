import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    profileUrl: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },

    // NEW: For like.controller.js to work
    likes: {
      type: [String], // array of user IDs who liked this profile
      default: [],
    },

    // NEW: For saved.controller.js to work
    savedRepos: [
      {
        repoId: { type: String, required: true },
        name: { type: String },
        description: { type: String },
        html_url: { type: String },
        clone_url: { type: String },
        stargazers_count: { type: Number },
        forks_count: { type: Number },
        language: { type: String },
        created_at: { type: String },
        owner: {
          login: { type: String },
          avatar_url: { type: String },
        }
      }
    ],

    // NEW: Achievement system
    achievements: [{
      achievementId: { type: String, required: true },
      unlockedAt: { type: Date, default: Date.now },
      progress: { type: Number, default: 0 }
    }],
    totalPoints: { type: Number, default: 0 },
    achievementStats: {
      totalUnlocked: { type: Number, default: 0 },
      rarestAchievement: String,
      favoriteCategory: String
    },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
