import { IoLocationOutline } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill, RiUserFollowLine } from "react-icons/ri";
import { FaXTwitter, FaEye } from "react-icons/fa6";
import { TfiThought } from "react-icons/tfi";

const ProfileInfo = ({ userProfile }) => {
  if (!userProfile) return null;

  const stats = [
    { icon: <RiUserFollowFill className="w-5 h-5 text-blue-800" />, label: "Followers", value: userProfile.followers },
    { icon: <RiUserFollowLine className="w-5 h-5 text-blue-800" />, label: "Following", value: userProfile.following },
    { icon: <RiGitRepositoryFill className="w-5 h-5 text-blue-800" />, label: "Public repos", value: userProfile.public_repos },
    { icon: <RiGitRepositoryFill className="w-5 h-5 text-blue-800" />, label: "Public gists", value: userProfile.public_gists },
  ];

  const InfoItem = ({ label, value }) =>
    value && (
      <div className="my-2">
        <p className="text-gray-600 font-bold text-sm">{label}</p>
        <p className="truncate">{value}</p>
      </div>
    );

  return (
    <div className="lg:w-1/3 w-full flex flex-col gap-2 lg:sticky md:top-10">
      <div className="bg-glass rounded-lg p-4">
        <div className="flex gap-3 items-center">
          <a href={userProfile.html_url} target="_blank" rel="noreferrer">
            <img
              src={userProfile.avatar_url}
              className="rounded-md w-24 h-24 mb-2"
              alt={`${userProfile.name}'s avatar`}
            />
          </a>
          <div className="flex gap-2 items-center flex-col">
            <a
              href={userProfile.html_url}
              target="_blank"
              rel="noreferrer"
              className="bg-glass font-medium w-full text-xs p-2 rounded-md cursor-pointer border border-blue-400 flex items-center gap-2"
            >
              <FaEye size={16} />
              View on GitHub
            </a>
          </div>
        </div>

        {userProfile.bio && (
          <div className="flex items-center gap-2">
            <TfiThought />
            <span className="text-sm">{userProfile.bio}</span>
          </div>
        )}

        {userProfile.location && (
          <div className="flex items-center gap-2">
            <IoLocationOutline />
            <span>{userProfile.location}</span>
          </div>
        )}

        {userProfile.twitter_username && (
          <a
            href={`https://twitter.com/${userProfile.twitter_username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-sky-500"
          >
            <FaXTwitter />
            <span>@{userProfile.twitter_username}</span>
          </a>
        )}

        <div className="my-2">
          <p className="text-gray-600 font-bold text-sm">Member since</p>
          <p>21 Sep, 2023</p>
        </div>

        {userProfile.email && <InfoItem label="Email address" value={userProfile.email} />}
        {userProfile.name && <InfoItem label="Full name" value={userProfile.name} />}
        <InfoItem label="Username" value={userProfile.login} />
      </div>

      <div className="flex flex-wrap gap-2 mx-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-glass rounded-lg p-2 flex-1 min-w-24"
          >
            {stat.icon}
            <p className="text-xs">
              {stat.label}: {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
