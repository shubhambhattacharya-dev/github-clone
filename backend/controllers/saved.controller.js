import User from '../models/user.model.js';

// Centralized error formatting for saved repos
const handleSavedError = (error) => {
  console.error('Saved repository error:', error);

  const newError = new Error();

  if (error.name === 'ValidationError') {
    newError.message = 'Invalid input data';
    newError.statusCode = 400;
    return newError;
  }

  if (error.name === 'CastError') {
    newError.message = 'Invalid ID format';
    newError.statusCode = 400;
    return newError;
  }

  newError.message = 'Internal server error during saved repo operation';
  newError.statusCode = 500;
  return newError;
};

// Helper to fetch repo data from GitHub
const fetchRepoData = async (repoFullName) => {
  const GITHUB_TOKEN = process.env.GITHUB_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000); // 10 seconds timeout

  try {
    const res = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
        'User-Agent': 'github-clone-app'
      },
      signal: controller.signal
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// Save a repository
export const saveRepository = async (req, res, next) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const { repoFullName } = req.body; // e.g., "facebook/react"

    if (!repoFullName || typeof repoFullName !== "string" || repoFullName.trim() === "") {
      const error = new Error("Repository full name required");
      error.statusCode = 400;
      throw error;
    }

    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }
    if (!repoFullName) {
      const error = new Error('Repository full name required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const alreadySaved = user.savedRepos.some(saved => saved.repoId === repoFullName);
    if (alreadySaved) {
      return res.json({ 
        success: true, 
        message: 'Repository already saved', 
        data: user.savedRepos 
      });
    }

    // Fetch repo data from GitHub
    const repoData = await fetchRepoData(repoFullName);
    const repoObject = {
      repoId: repoFullName,
      name: repoData.name,
      description: repoData.description,
      html_url: repoData.html_url,
      clone_url: repoData.clone_url,
      stargazers_count: repoData.stargazers_count,
      forks_count: repoData.forks_count,
      language: repoData.language === "C#" ? "Csharp" : repoData.language,
      created_at: repoData.created_at,
      owner: {
        login: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url,
      }
    };

    user.savedRepos.push(repoObject);
    await user.save();

    return res.json({ 
      success: true, 
      message: 'Repository saved successfully', 
      data: user.savedRepos 
    });
  } catch (error) {
    next(handleSavedError(error));
  }
};

// Unsave a repository
export const unsaveRepository = async (req, res, next) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    // Get repoId from wildcard param
    const repoId = req.params[0]; // repoFullName string

    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedRepos: { repoId: repoId } } },
      { new: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: user.savedRepos });
  } catch (error) {
    next(handleSavedError(error));
  }
};

// Get saved repositories (with pagination)
export const getSavedRepos = async (req, res, next) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .lean(); // return plain JS object

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Apply pagination manually on populated array
    const total = user.savedRepos.length;
    const paginatedData = user.savedRepos.slice(skip, skip + limit);

    res.json({
      success: true,
      data: paginatedData,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(handleSavedError(error));
  }
};
