const ProfileInfo = ({ userProfile }) => {
  if (!userProfile) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="text-center">
        <img
          src={userProfile.avatar_url}
          alt={userProfile.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
        />
        <h2 className="text-2xl font-bold text-white mb-2">{userProfile.name}</h2>
        <p className="text-gray-300 mb-4">@{userProfile.login}</p>
        <p className="text-white mb-4">{userProfile.bio}</p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{userProfile.public_repos}</div>
            <div className="text-gray-300 text-sm">Repos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userProfile.followers}</div>
            <div className="text-gray-300 text-sm">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userProfile.following}</div>
            <div className="text-gray-300 text-sm">Following</div>
          </div>
        </div>

        <div className="mt-4">
          <a
            href={userProfile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;