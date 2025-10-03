import User from '../models/user.model.js';

// Centralized error formatting for likes
const handleLikeError = (error) => {
  console.error('Like operation error:', error);

  const newError = new Error();

  if (error.name === 'ValidationError') {
    newError.message = 'Invalid input data';
    newError.statusCode = 400;
    return newError;
  }

  if (error.name === 'CastError') {
    newError.message = 'Invalid user ID format';
    newError.statusCode = 400;
    return newError;
  }

  if (error.code === 11000) {
    newError.message = 'Duplicate like detected';
    newError.statusCode = 409;
    return newError;
  }

  newError.message = 'Internal server error during like operation';
  newError.statusCode = 500;
  return newError;
};

// Like a profile
export const likeProfile = async (req, res, next) => {
  try {
    const likerId = req.user && (req.user._id || req.user.id);
    const { username } = req.params;

    if (!username || typeof username !== "string" || username.trim() === "") {
      const error = new Error("Invalid username");
      error.statusCode = 400;
      throw error;
    }

    if (!likerId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const target = await User.findOne({ username });
    if (!target) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (target._id.toString() === likerId) {
      const error = new Error('You cannot like your own profile');
      error.statusCode = 400;
      throw error;
    }

    const already = target.likes.includes(likerId);
    if (already) {
      return res.json({ 
        success: true, 
        message: 'You already liked this profile', 
        likesCount: target.likes.length 
      });
    }

    target.likes.push(likerId);
    await target.save();

    return res.json({ 
      success: true, 
      message: 'Profile liked successfully', 
      likesCount: target.likes.length 
    });
  } catch (err) {
    const formattedError = handleLikeError(err);
    next(formattedError);
  }
};

// Unlike a profile
export const unlikeProfile = async (req, res, next) => {
  try {
    const likerId = req.user && (req.user._id || req.user.id);
    const { username } = req.params;

    if (!username || typeof username !== "string" || username.trim() === "") {
      const error = new Error("Invalid username");
      error.statusCode = 400;
      throw error;
    }

    if (!likerId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const target = await User.findOne({ username });
    if (!target) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const wasLiked = target.likes.includes(likerId);
    if (!wasLiked) {
      return res.json({ 
        success: true, 
        message: 'Profile was not liked', 
        likesCount: target.likes.length 
      });
    }

    target.likes = target.likes.filter(id => id !== likerId);
    await target.save();

    return res.json({ 
      success: true, 
      message: 'Profile unliked', 
      likesCount: target.likes.length 
    });
  } catch (err) {
    const formattedError = handleLikeError(err);
    next(formattedError);
  }
};

// Get like status
export const likeStatus = async (req, res, next) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    const { username } = req.params;

    if (!username || typeof username !== "string" || username.trim() === "") {
      const error = new Error("Invalid username");
      error.statusCode = 400;
      throw error;
    }

    const target = await User.findOne({ username }).select('likes');
    if (!target) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const likesCount = target.likes.length;
    const liked = !!(userId && target.likes.includes(userId));

    return res.json({ success: true, liked, likesCount });
  } catch (err) {
    const formattedError = handleLikeError(err);
    next(formattedError);
  }
};
