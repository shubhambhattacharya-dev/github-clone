import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 10
  },
  category: {
    type: String,
    enum: ['social', 'productivity', 'exploration', 'special'],
    required: true
  },
  requirements: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      default: 'gte'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Achievement", achievementSchema);