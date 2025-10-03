export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.redirect(process.env.CLIENT_BASE_URL + "/login");
}
