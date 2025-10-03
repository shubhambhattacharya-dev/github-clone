export const handleLoginWithGithub = () => {
	window.open("/api/auth/github", "_self");
};

export const fetchSavedRepos = async ({ page = 1, limit = 10 } = {}) => {
	try {
		const res = await fetch(`/api/saved?page=${page}&limit=${limit}`, {
			credentials: 'include'
		});
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.error || 'Failed to fetch saved repos');
		}
		return data;
	} catch (error) {
		throw error;
	}
};

export const removeSavedRepo = async (repoId) => {
	try {
		const res = await fetch(`/api/saved/${repoId}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.error || 'Failed to remove saved repo');
		}
		return data;
	} catch (error) {
		throw error;
	}
};
