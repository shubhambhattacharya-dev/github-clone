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

export const saveRepository = async (repo) => {
  try {
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ repo })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save repository');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeSavedRepo = async (repoFullName) => {
  try {
    const res = await fetch(`/api/saved/${encodeURIComponent(repoFullName)}`, {
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

export const fetchStarredRepos = async ({ page = 1, limit = 10 } = {}) => {
	try {
		const res = await fetch(`/api/starred?page=${page}&limit=${limit}`, {
			credentials: 'include'
		});
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.error || 'Failed to fetch starred repos');
		}
		return data;
	} catch (error) {
		throw error;
	}
};

export const starRepository = async (repo) => {
  try {
    const res = await fetch('/api/starred', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ repo })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to star repository');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const unstarRepository = async (repoFullName) => {
  try {
    const res = await fetch(`/api/starred/${encodeURIComponent(repoFullName)}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to unstar repository');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
