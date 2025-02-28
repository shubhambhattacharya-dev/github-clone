import React from "react";
import Repo from "./Repo";

const Repos = ({ repos, alwaysFullWidth = false }) => {
  const containerClass = alwaysFullWidth ? "w-full" : "lg:w-2/3 w-full";

  return (
    <div className={`${containerClass} bg-glass rounded-lg px-8 py-6`}>
      {repos.length > 0 ? (
        <ol className="relative border-s border-gray-200">
          {repos.map((repo) => (
            <Repo key={repo.id} repo={repo} />
          ))}
        </ol>
      ) : (
        <p className="flex items-center justify-center h-32">
          No repos found
        </p>
      )}
    </div>
  );
};

export default Repos;
