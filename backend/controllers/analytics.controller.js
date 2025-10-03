import axios from "axios";
import AnalyticsCache from "../models/analyticsCache.model.js";

// Use env variable directly
const GITHUB_TOKEN = process.env.GITHUB_API_KEY; // ensure this exists in .env

// Helper to fetch GitHub API data
const fetchGitHubData = async (url) => {
  try {
    const res = await axios.get(`https://api.github.com${url}`, {
      headers: {
        ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
        "User-Agent": "github-clone-app"
      },
      timeout: 10000
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 403) {
        const error = new Error("GitHub API rate limit exceeded");
        error.statusCode = 429;
        throw error;
      }
      if (status === 404) {
        const error = new Error("Repository not found");
        error.statusCode = 404;
        throw error;
      }
      if (status >= 400 && status < 500) {
        const error = new Error(`Client error: ${status}`);
        error.statusCode = 400;
        throw error;
      }
      const error = new Error(`GitHub API server error: ${status}`);
      error.statusCode = 500;
      throw error;
    } else if (err.request) {
      const error = new Error("No response from GitHub API. Network error or request timeout.");
      error.statusCode = 503;
      throw error;
    } else {
      const error = new Error(`Request setup error: ${err.message}`);
      error.statusCode = 500;
      throw error;
    }
  }
};

// Main controller to get repo analytics
export const getRepoAnalytics = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    if (!owner || typeof owner !== "string" || owner.trim() === "") {
      return res.status(400).json({ success: false, message: "Repository owner is required" });
    }
    if (!repo || typeof repo !== "string" || repo.trim() === "") {
      return res.status(400).json({ success: false, message: "Repository name is required" });
    }

    const repoFullName = `${owner}/${repo}`;

    // Check cache first (1 hour)
    let cached = await AnalyticsCache.findOne({ repoFullName });
    if (cached && (Date.now() - cached.lastUpdated.getTime()) < 3600000) {
      return res.json({
        success: true,
        source: "cache",
        contributors: cached.contributors,
        commitActivity: cached.commitActivity,
        codeFrequency: cached.codeFrequency,
        lastUpdated: cached.lastUpdated
      });
    }

    // Fetch live data from GitHub
    const [contributors, commitActivityRaw, codeFrequencyRaw] = await Promise.all([
      fetchGitHubData(`/repos/${repoFullName}/contributors?per_page=10`),
      fetchGitHubData(`/repos/${repoFullName}/stats/commit_activity`),
      fetchGitHubData(`/repos/${repoFullName}/stats/code_frequency`)
    ]);

    // Ensure commitActivity and codeFrequency are arrays
    const commitActivity = Array.isArray(commitActivityRaw) ? commitActivityRaw : [];
    const codeFrequency = Array.isArray(codeFrequencyRaw) ? codeFrequencyRaw : [];

    // Update or create cache
    const analytics = await AnalyticsCache.findOneAndUpdate(
      { repoFullName },
      {
        contributors: contributors.map(c => ({
          author: c.login,
          commits: c.contributions
        })),
        commitActivity: commitActivity.map(c => ({
          week: c.week,
          total: c.total
        })),
        codeFrequency: codeFrequency.map(c => ({
          timestamp: c[0],
          additions: c[1],
          deletions: c[2]
        })),
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      source: "github",
      contributors: analytics.contributors,
      commitActivity: analytics.commitActivity,
      codeFrequency: analytics.codeFrequency,
      lastUpdated: analytics.lastUpdated
    });
  } catch (err) {
    next(err);
  }
};
