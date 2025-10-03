// backend/middleware/asyncWrapper.js
export const asyncHandler = (fn) => (req, res, next) => {
  try {
    // Input validation based on route
    const path = req.route.path;
    if (path.includes(':username')) {
      const { username } = req.params;
      if (!username || typeof username !== "string" || username.trim() === "") {
        const error = new Error("Invalid username parameter");
        error.statusCode = 400;
        return next(error);
      }
    }
    if (path.includes(':language')) {
      const { language } = req.params;
      if (!language || typeof language !== "string" || language.trim() === "") {
        const error = new Error("Invalid language parameter");
        error.statusCode = 400;
        return next(error);
      }
    }
    if (path.includes(':owner') && path.includes(':repo')) {
      const { owner, repo } = req.params;
      if (!owner || typeof owner !== "string" || owner.trim() === "") {
        const error = new Error("Invalid owner parameter");
        error.statusCode = 400;
        return next(error);
      }
      if (!repo || typeof repo !== "string" || repo.trim() === "") {
        const error = new Error("Invalid repo parameter");
        error.statusCode = 400;
        return next(error);
      }
    }
    if (req.method === 'POST' && req.body && req.body.repoFullName) {
      const { repoFullName } = req.body;
      if (!repoFullName || typeof repoFullName !== "string" || repoFullName.trim() === "") {
        const error = new Error("Repository full name required");
        error.statusCode = 400;
        return next(error);
      }
    }

    // Execute the original controller
    Promise.resolve(fn(req, res, next)).catch(next);
  } catch (err) {
    next(err);
  }
};