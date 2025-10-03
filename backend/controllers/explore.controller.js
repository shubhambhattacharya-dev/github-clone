export const explorePopularRepos = async (req, res, next) => {
	const { language } = req.params;

	if (!language || typeof language !== "string" || language.trim() === "") {
		const error = new Error("Language parameter is required");
		error.statusCode = 400;
		throw error;
	}

	try {
		// 5000 requests per hour for authenticated requests
		const response = await fetch(
			`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,
			{
				headers: {
					authorization: `token ${process.env.GITHUB_API_KEY}`,
				},
			}
		);

		// Check for non-200 responses
		if (!response.ok) {
			let message = `GitHub API error: ${response.status}`;
			if (response.status === 403) message = "GitHub API rate limit exceeded";
			if (response.status === 404) message = "Repositories not found";
			throw new Error(message);
		}

		const data = await response.json();
		res.status(200).json({ repos: data.items });
	} catch (error) {
		next(error);
	}
};
