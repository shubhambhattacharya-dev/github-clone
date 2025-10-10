#!/usr/bin/env node

/**
 * Initialize Achievements Script
 * Run this to set up achievements in your database
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Achievement model (inline to avoid import issues)
const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, required: true },
  rarity: { type: String, required: true },
  requirements: {
    type: { type: String, required: true },
    value: { type: Number, required: true },
    condition: { type: String, default: 'gte' }
  },
  points: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

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

async function initializeAchievements() {
  try {
    console.log('🔗 Connecting to MongoDB...');

    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL environment variable is not set');
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    console.log('🏆 Initializing achievements...');

    for (const ach of ACHIEVEMENTS) {
      const existing = await Achievement.findOne({ id: ach.id });

      if (existing) {
        console.log(`⏭️  Achievement "${ach.name}" already exists, skipping...`);
      } else {
        await Achievement.create(ach);
        console.log(`✅ Created achievement: "${ach.name}"`);
      }
    }

    console.log('🎉 Achievements initialization completed!');
    console.log(`📊 Total achievements in database: ${await Achievement.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error initializing achievements:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the initialization
initializeAchievements();