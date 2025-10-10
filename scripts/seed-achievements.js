import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from '../backend/models/achievement.model.js';

dotenv.config();

const achievements = [
  {
    id: 'first_login',
    name: 'Welcome Aboard!',
    description: 'Logged in for the first time',
    icon: '🎉',
    rarity: 'common',
    points: 5,
    category: 'special',
    requirements: {
      type: 'login_count',
      value: 1,
      condition: 'gte'
    },
    isActive: true
  },
  {
    id: 'repo_collector',
    name: 'Repository Collector',
    description: 'Saved 5 repositories',
    icon: '📚',
    rarity: 'common',
    points: 15,
    category: 'exploration',
    requirements: {
      type: 'repos_saved',
      value: 5,
      condition: 'gte'
    },
    isActive: true
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Liked 10 profiles',
    icon: '🦋',
    rarity: 'rare',
    points: 25,
    category: 'social',
    requirements: {
      type: 'likes_given',
      value: 10,
      condition: 'gte'
    },
    isActive: true
  },
  {
    id: 'popular_user',
    name: 'Popular User',
    description: 'Received 5 likes on your profile',
    icon: '⭐',
    rarity: 'rare',
    points: 30,
    category: 'social',
    requirements: {
      type: 'likes_received',
      value: 5,
      condition: 'gte'
    },
    isActive: true
  },
  {
    id: 'star_collector',
    name: 'Star Collector',
    description: 'Saved repositories with 100+ total stars',
    icon: '🌟',
    rarity: 'epic',
    points: 50,
    category: 'exploration',
    requirements: {
      type: 'stars_earned',
      value: 100,
      condition: 'gte'
    },
    isActive: true
  },
  {
    id: 'puzzle_master',
    name: 'Puzzle Master',
    description: 'Completed your first contribution puzzle challenge',
    icon: '🏆',
    rarity: 'epic',
    points: 75,
    category: 'productivity',
    requirements: {
      type: 'puzzles_completed',
      value: 1,
      condition: 'gte'
    },
    isActive: true
  }
];

async function seedAchievements() {
  try {
    console.log('🌱 Seeding achievements...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('🗑️ Cleared existing achievements');

    // Insert new achievements
    const insertedAchievements = await Achievement.insertMany(achievements);
    console.log(`✅ Seeded ${insertedAchievements.length} achievements`);

    // List the achievements
    console.log('\n📋 Seeded Achievements:');
    insertedAchievements.forEach(achievement => {
      console.log(`  - ${achievement.icon} ${achievement.name} (${achievement.rarity})`);
    });

    console.log('\n🎉 Achievement seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
seedAchievements();