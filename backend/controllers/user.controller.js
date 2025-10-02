import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) => {
	const { username } = req.params;
  
	try {
		if (!process.env.GITHUB_API_KEY) {
			throw new Error("GitHub API key is missing in environment variables.");
		}

		// Fetch user profile
		const userRes = await fetch(`https://api.github.com/users/${username}`, {
			headers: { authorization: `token ${process.env.GITHUB_API_KEY}` },
		});
		if (!userRes.ok) throw new Error(`GitHub API error: ${userRes.statusText}`);

		const userProfile = await userRes.json();
    
		// Fetch repositories
		const repoRes = await fetch(userProfile.repos_url, {
			headers: { authorization: `token ${process.env.GITHUB_API_KEY}` },
		});
		if (!repoRes.ok) throw new Error(`GitHub API error: ${repoRes.statusText}`);

		const repos = await repoRes.json();

		return res.status(200).json({ userProfile, repos });
	} catch (error) {
		return res.status(500).json({ error: error.message || "Internal Server Error" });
	}
};

export const likeProfile = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await User.findById(req.user?._id.toString());
		if (!user) return res.status(401).json({ error: "Unauthorized" });

		const userToLike = await User.findOne({ username });
		if (!userToLike) return res.status(404).json({ error: "User is not a member" });

		if (user.likedProfiles.includes(userToLike.username)) {
			return res.status(400).json({ error: "User already liked" });
		}

		// Use MongoDB `$push` for atomic updates
		await Promise.all([
			User.updateOne({ _id: user._id }, { $push: { likedProfiles: userToLike.username } }),
			User.updateOne({ username }, { 
				$push: { likedBy: { username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() } }
			})
		]);

		return res.status(200).json({ message: "User liked" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getLikes = async (req, res) => {
	try {
		const user = await User.findById(req.user?._id.toString());
		if (!user) return res.status(401).json({ error: "Unauthorized" });

		return res.status(200).json({ likedBy: user.likedBy || [] });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
