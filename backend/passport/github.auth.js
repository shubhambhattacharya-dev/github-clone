import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

dotenv.config();

// Serialize only the user ID
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

// Deserialize by fetching user from DB
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ username: profile.username });

        if (!user) {
          // Create new user with only valid schema fields
          const newUser = new User({
            name: profile.displayName || "",
            username: profile.username,
            profileUrl: profile.profileUrl || "",
            avatarUrl: profile.photos?.[0]?.value || "",
            likes: [],       // valid field
            savedRepos: [],  // valid field
          });
          await newUser.save();
          user = newUser;
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
