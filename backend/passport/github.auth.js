import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

dotenv.config();

passport.serializeUser((user, done) => {
	done(null, user.id); // Store only the user ID in the session
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		console.error("Error deserializing user:", err);
		done(err, null);
	}
});

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "http://localhost:5000/api/auth/github/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Use GitHub username if available; otherwise, fallback to GitHub ID
				const username = profile.username || profile.id;
				let user = await User.findOne({ username });

				// If user doesn't exist, create a new one
				if (!user) {
					user = new User({
						name: profile.displayName || "GitHub User", // Handle missing name
						username,
						profileUrl: profile.profileUrl,
						avatarUrl: profile.photos?.[0]?.value || "", // Handle missing photo
						likedProfiles: [],
						likedBy: [],
					});
					await user.save();
				}

				done(null, user);
			} catch (error) {
				console.error("GitHub authentication error:", error);
				done(error, null);
			}
		}
	)
);
