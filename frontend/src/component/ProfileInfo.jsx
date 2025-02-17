import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill, RiUserFollowLine } from "react-icons/ri";
import { FaXTwitter, FaEye } from "react-icons/fa6";
import { TfiThought } from "react-icons/tfi";

const ProfileInfo = ({ userProfile }) => {
  // Prevent errors if userProfile is not yet loaded
  if (!userProfile) return null;

  // const userProfile = {
  //   avatar_url: "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745",
  //   bio: "👨🏻‍💻👨🏻‍💻👨🏻‍💻",
  //   email: "johndoe@gmail.com",
  //   followers: 100,
  //   following: 200,
  //   html_url: "https://github.com/burakorkmez",
  //   location: "Somewhere, Earth",
  //   name: "John Doe",
  //   public_gists: 100,
  //   public_repos: 100,
  //   twitter_username: "johndoe",
  //   login: "johndoe",
  // };

  const stats = [
    { icon: <RiUserFollowFill className="text-blue-800" />, label: "Followers", value: userProfile.followers },
    { icon: <RiUserFollowLine className="text-blue-800" />, label: "Following", value: userProfile.following },
    { icon: <RiGitRepositoryFill className="text-blue-800" />, label: "Public repos", value: userProfile.public_repos },
    { icon: <RiGitRepositoryFill className="text-blue-800" />, label: "Public gists", value: userProfile.public_gists },
  ];

  const InfoItem = ({ label, value, children }) =>
    value && (
      <div className="my-2">
        <p className="text-gray-600 font-bold text-sm">{label}</p>
        {children || <p className="truncate">{value}</p>}
      </div>
    );

  return (
    <div className="lg:w-1/3 w-full flex flex-col gap-4 md:sticky md:top-10">
      <div className="bg-glass rounded-lg p-4 space-y-4">
        <div className="flex gap-4 items-start">
          <a
            href={userProfile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img
              src={userProfile.avatar_url}
              className="rounded-md w-24 h-24"
              alt={`${userProfile.name}'s avatar`}
            />
          </a>

          <a
            href={userProfile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-glass hover:bg-glass-hover transition-colors text-xs p-2 rounded-md border border-blue-400 flex items-center gap-2 flex-1"
          >
            <FaEye className="flex-shrink-0" />
            <span className="truncate">View on GitHub</span>
          </a>
        </div>

        <div className="space-y-3">
          {userProfile.bio && (
            <div className="flex items-center gap-2 text-sm">
              <TfiThought />
              <span>{userProfile.bio}</span>
            </div>
          )}

          {userProfile.location && (
            <div className="flex items-center gap-2">
              <IoLocationOutline />
              {userProfile.location}
            </div>
          )}

          {userProfile.twitter_username && (
            <a
              href={`https://twitter.com/${userProfile.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-sky-500 transition-colors"
            >
              <FaXTwitter />
              @{userProfile.twitter_username}
            </a>
          )}
        </div>

        <div className="space-y-2">
          <InfoItem label="Member since" value="21 Sep, 2023" />
          <InfoItem label="Email address" value={userProfile.email} />
          <InfoItem label="Full name" value={userProfile.name} />
          <InfoItem label="Username" value={userProfile.login} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => (
          <div key={index} className="bg-glass rounded-lg p-3 flex items-center gap-2">
            {stat.icon}
            <div>
              <p className="text-xs font-medium">{stat.label}</p>
              <p className="text-sm">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
