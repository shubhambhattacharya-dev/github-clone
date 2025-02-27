import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import ProfileInfo from "../component/ProfileInfo.jsx";
import Repos from "../component/Repos.jsx";
import Search from "../component/Search.jsx";
import SortRepos from "../component/SortRepos.jsx";
import Spinner from "../component/Spinner.jsx";

const HomePage = () => {
  const [userProfile, setUserProfileInfo] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState(""); // Added missing sortType state

  const getUserProfileAndRepos = useCallback(
    async (username = "shubhambhattacharya-dev") => {
      setLoading(true);
      try {
        const userRes = await fetch(
          `https://api.github.com/users/${username}`
        );
        const profileData = await userRes.json();
        setUserProfileInfo(profileData);

        const repoRes = await fetch(profileData.repos_url);
        const repoData = await repoRes.json();
        setRepos(repoData);
        console.log("userProfile:", profileData);
        console.log("repos:", repoData);
        return { userProfile: profileData, repos: repoData };
      } catch (error) {
        toast.error(error.message);
        // Return a consistent object to avoid destructuring errors
        return { userProfile: null, repos: [] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();

    setLoading(true);
    setRepos([]);
    setUserProfileInfo(null);

    const result = await getUserProfileAndRepos(username);
    if (result) {
      const { userProfile, repos } = result;
      setUserProfileInfo(userProfile);
      setRepos(repos);
    }
    setLoading(false);
  };

  const onSort = (sortType) => {
    if (sortType === "recent") {
      repos.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ); // recent
    } else if (sortType === "stars") {
      repos.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      ); // stars
    } else if (sortType === "forks") {
      repos.sort((a, b) => b.forks_count - a.forks_count); // forks
    }
    setSortType(sortType);
    setRepos([...repos]);
  };

  return (
    <div className="m-4">
      <Search onSearch={onSearch} />
      {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start overflow-hidden">
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {/* Always render Repos so the "No repos found" message can display */}
        {!loading && <Repos repos={repos} />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default HomePage;
