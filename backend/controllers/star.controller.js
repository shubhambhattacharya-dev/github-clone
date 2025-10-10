import User from '../models/user.model.js';

// Centralized error formatting for starred repos
const handleStarredError = (error) => {
  console.error('Starred repository error:', error);

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

  newError.message = 'Internal server error during starred repo operation';
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

// Star a repository
export const starRepository = async (req, res, next) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const { repo } = req.body; // Full repo object from frontend

    if (!repo || (!repo.full_name && (!repo.name || !repo.owner?.login))) {
      const error = new Error("Repository data required");
      error.statusCode = 400;
      throw error;
    }

    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Ensure starredRepos is an array
    if (!user.starredRepos) {
      user.starredRepos = [];
    }

    // Use repo data from frontend instead of fetching from GitHub
    const fullName = repo.full_name || `${repo.owner?.login}/${repo.name}`;

    const alreadyStarred = user.starredRepos.some(starred => starred.repoId === fullName);
    if (alreadyStarred) {
      return res.json({
        success: true,
        message: 'Repository already starred',
        data: user.starredRepos
      });
    }
    const repoObject = {
      repoId: fullName,
      id: repo.id || 0,
      name: repo.name || '',
      full_name: fullName,
      html_url: repo.html_url || '',
      description: repo.description || '',
      language: repo.language || '',
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      owner: {
        login: repo.owner?.login || '',
        avatar_url: repo.owner?.avatar_url || '',
      },
      starredDate: new Date(),
    };

    user.starredRepos.push(repoObject);
    try {
      await user.save();
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      throw new Error('Failed to save repository to database');
    }

    // TODO: Check for achievements
    // const unlockedAchievements = await checkAndAwardAchievements(user._id, 'repo_starred');

    return res.json({
      success: true,
      message: 'Repository starred successfully',
      data: user.starredRepos,
      // unlockedAchievements: unlockedAchievements.map(a => ({
      //   name: a.name,
      //   icon: a.icon,
      //   description: a.description
      // }))
    });
  } catch (error) {
    next(handleStarredError(error));
  }
};

// Unstar a repository
export const unstarRepository = async (req, res, next) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const { repoId } = req.params; // repo full name

    if (!userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    if (!repoId) {
      const error = new Error('Repository ID required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { starredRepos: { repoId: repoId } } },
      { new: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: user.starredRepos });
  } catch (error) {
    next(handleStarredError(error));
  }
};

// Get starred repositories (with pagination)
export const getStarredRepos = async (req, res, next) => {
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

    // Ensure starredRepos is an array
    if (!user.starredRepos) {
      user.starredRepos = [];
    }

    // Apply pagination manually on populated array
    const total = user.starredRepos.length;
    const paginatedData = user.starredRepos.slice(skip, skip + limit);

    res.json({
      success: true,
      data: paginatedData,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(handleStarredError(error));
  }
};