import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileInfo from "../component/ProfileInfo";
import Repos from "../component/Repos";
import Search from "../component/Search";
import SortRepos from "../component/SortRepos";
import Spinner from "../component/Spinner";
import { useAuthContext } from "../context/AuthContext";

const HomePage = () => {
	const { authUser } = useAuthContext();
	const [userProfile, setUserProfile] = useState(null);
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(false);

	const [sortType, setSortType] = useState("recent");

	// Unified loading state management
	const getUserProfileAndRepos = async (username) => {
		if (!username) {
			toast.error("No username provided");
			return { userProfile: null, repos: [] };
		}

		setLoading(true); // start loading
		try {
			const res = await fetch(`/api/users/profile/${username}`, {
				credentials: "include" // <--- Send cookies for authenticated backend
			});
			const { repos, userProfile } = await res.json();

			const sortedRepos = [...repos].sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			); // descending, recent first

			setRepos(sortedRepos);
			setUserProfile(userProfile);

			return { userProfile, repos: sortedRepos };
		} catch (error) {
			toast.error(error?.message || "Failed to fetch user profile and repos"); // safe default
			return { userProfile: null, repos: [] };
		} finally {
			setLoading(false); // stop loading
		}
	};

	useEffect(() => {
		if (authUser && authUser.username) {
			getUserProfileAndRepos(authUser.username);
		} else {
			setUserProfile(null);
			setRepos([]);
		}
	}, [authUser]);

	const onSearch = async (e, username) => {
		e.preventDefault();

		// No need to manually setLoading here; getUserProfileAndRepos already manages it
		setRepos([]);
		setUserProfile(null);

		const { userProfile, repos } = await getUserProfileAndRepos(username);

		setUserProfile(userProfile);
		setRepos(repos);
		setSortType("recent");
	};

	const onSort = (sortType) => {
		const sortedRepos = [...repos]; // Create a new array to avoid mutating state directly

		if (sortType === "recent") {
			sortedRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		} else if (sortType === "stars") {
			sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (sortType === "forks") {
			sortedRepos.sort((a, b) => b.forks_count - a.forks_count);
		}

		setSortType(sortType);
		setRepos(sortedRepos);
	};

	return (
		<div className='m-4'>
			<Search onSearch={onSearch} />
			{repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
			<div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
				{userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
				{!loading && <Repos repos={repos} />}
				{loading && <Spinner />}
			</div>
		</div>
	);
};

export default HomePage;
