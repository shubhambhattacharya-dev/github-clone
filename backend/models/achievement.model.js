import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, enum: ['social', 'productivity', 'exploration', 'special'] },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
  requirements: {
    type: { type: String },
    value: { type: Number },
    condition: { type: String }
  },
  points: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Achievement", achievementSchema);