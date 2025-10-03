// backend/models/analyticsCache.model.js
import mongoose from "mongoose";

const AnalyticsCacheSchema = new mongoose.Schema({
  repoFullName: { type: String, required: true, unique: true }, // owner/repo
  contributors: [{
    author: { type: String },
    commits: { type: Number },
    additions: { type: Number },
    deletions: { type: Number }
  }],
  commitActivity: [{
    week: { type: Number }, // unix timestamp (seconds)
    total: { type: Number } // total commits that week
  }],
  codeFrequency: [{
    timestamp: { type: Number }, // unix timestamp (seconds)
    additions: { type: Number },
    deletions: { type: Number }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

// Optional TTL index — documents expire 1 hour after lastUpdated
AnalyticsCacheSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 3600 });

const AnalyticsCache = mongoose.model("AnalyticsCache", AnalyticsCacheSchema);
export default AnalyticsCache;
