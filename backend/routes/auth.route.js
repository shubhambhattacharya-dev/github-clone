import express from "express";
import passport from "passport";

const router = express.Router();

// GitHub authentication route
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub callback route
router.get(
	"/github/callback",
	passport.authenticate("github", { failureRedirect: process.env.CLIENT_BASE_URL + "/login" }),
	(req, res) => {
		res.redirect(process.env.CLIENT_BASE_URL);
	}
);

// Check if user is authenticated
router.get("/check", (req, res) => {
	if (req.isAuthenticated()) {
		res.json({ user: req.user });
	} else {
		res.json({ user: null });
	}
});

router.get("/me", (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: "Not logged in" });
	}


	res.json({ username: req.user.username });
});

router.get("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ message: "Logout failed", error: err });
		}
		req.session.destroy((err) => {
			if (err) {
				return res.status(500).json({ message: "Session destruction failed", error: err });
			}
			res.clearCookie("connect.sid"); // Clear session cookie
			res.json({ message: "Logged out successfully" });
		});
	});
});

export default router;
