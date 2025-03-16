export const getUserProfileAndRepos = async (req, res) => {
    const { username } = req.params;
    try {
      const userRes = await fetch(
        `https://api.github.com/users/${username}`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_API_KEY}`,
          },
        }
      );
      // Assign profile data to userProfile
      const userProfile = await userRes.json();
  
      // Remove or define setUserProfileInfo if needed
      // setUserProfileInfo(userProfile);
  
      const repoRes = await fetch(userProfile.repos_url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      });
      // Assign repo data to repos
      const repos = await repoRes.json();
  
      res.status(200).json({ userProfile, repos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  