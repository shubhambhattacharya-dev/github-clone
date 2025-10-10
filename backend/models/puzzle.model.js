import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  targetImage: {
    type: String, // base64 encoded image or URL
    required: function() {
      return this.puzzleType === 'image' || this.puzzleType === 'combined';
    }
  },
  repository: {
    name: String,
    full_name: String,
    html_url: String,
    description: String,
    language: String,
    stargazers_count: Number
  },
  puzzleType: {
    type: String,
    enum: ['image', 'repository', 'combined'],
    default: 'image'
  },
  imageName: {
    type: String,
    default: 'My Puzzle'
  },
  totalCommitsRequired: {
    type: Number,
    required: true
  },
  currentCommits: {
    type: Number,
    default: 0
  },
  commitsPerDay: {
    type: Number,
    default: 1 // estimated commits per day
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  estimatedCompletionDate: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

export default Puzzle;