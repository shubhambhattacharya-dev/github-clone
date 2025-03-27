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
  const [sortType, setSortType] = useState("recent");

  const getUserProfileAndRepos = useCallback(async (username = "shubhambhattacharya-dev") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const { repos = [], userProfile = null } = await res.json(); // Ensure default values

      console.log("userProfile:", userProfile);
      setUserProfileInfo(userProfile);

      if (Array.isArray(repos)) {
        const sortedRepos = [...repos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRepos(sortedRepos);
        console.log("repos:", sortedRepos);
      } else {
        setRepos([]); // Always set an array to prevent errors
      }

      return { userProfile, repos };
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      return { userProfile: null, repos: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();
    setLoading(true);
    setRepos([]);
    setUserProfileInfo(null);

    const result = await getUserProfileAndRepos(username);
    setUserProfileInfo(result?.userProfile || null);
    setRepos(result?.repos || []);
    
    setLoading(false);
    setSortType("recent");
  };

  const onSort = (sortType) => {
    let sortedRepos = [...repos];

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
    <div className="m-4">
      <Search onSearch={onSearch} />
      {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start overflow-hidden">
        {loading && <Spinner />}
        {!loading && userProfile && <ProfileInfo userProfile={userProfile} />}
        {!loading && <Repos repos={repos} />}
      </div>
    </div>
  );
};

export default HomePage;
