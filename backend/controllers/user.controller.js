export const getUserProfileAndRepos = async (req, res) => {
	const { username } = req.params;
	try {
		const userRes = await fetch(`https://api.github.com/users/${username}`, {
			headers: {
				authorization: `token ${process.env.GITHUB_API_KEY}`,
			},
		});

		if (!userRes.ok) {
			throw new Error(`GitHub API error: ${userRes.status} ${userRes.statusText}`);
		}

		const userProfile = await userRes.json();

		const repoRes = await fetch(userProfile.repos_url, {
			headers: {
				authorization: `token ${process.env.GITHUB_API_KEY}`,
			},
		});

		if (!repoRes.ok) {
			throw new Error(`GitHub API error: ${repoRes.status} ${repoRes.statusText}`);
		}

		const repos = await repoRes.json();

		res.status(200).json({ userProfile, repos });
	} catch (error) {
		console.error("Error fetching GitHub data:", error);
		res.status(500).json({ error: error.message });
	}
};
