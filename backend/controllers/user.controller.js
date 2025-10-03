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

export const getLikes = async (req, res) => {
	try {
		const userId = req.user && (req.user._id || req.user.id);
		if (!userId) {
			return res.status(401).json({ error: 'Not authenticated' });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json({ likedBy: user.likedBy });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
