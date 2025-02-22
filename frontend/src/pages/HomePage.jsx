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

  const getUserProfileAndRepos = useCallback(async (username="shubhambhattacharya-dev") => {
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
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e,username) => {
    e.preventDefault();

    setLoading(true);
    setRepos([]);
    setUserProfileInfo(null);

      await getUserProfileAndRepos(username);

  }
   

  return (
    <div className="m-4">
      <Search />
      <SortRepos />
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start overflow-hidden">
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {repos.length > 0 && !loading && <Repos repos={repos} />}
       
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default HomePage;
