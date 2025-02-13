import { MdLogout } from "react-icons/md";

const Logout = () => {
  const handleLogout = () => {
    // TODO: Implement actual logout functionality
    console.log("Logout clicked");
    // Suggested: Add confirmation dialog and actual logout logic
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
        alt="User profile"
        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-indigo-400 transition-all"
        loading="lazy"
        width="40"
        height="40"
      />

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-2 rounded-lg bg-glass mt-auto border border-gray-300 hover:border-indigo-400 hover:bg-gray-700/30 transition-colors group"
        aria-label="Logout"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLogout();
          }
        }}
      >
        <MdLogout 
          size={22}
          className="text-gray-100 group-hover:text-indigo-300 transition-colors"
        />
        <span className="sr-only">Logout</span>
      </button>
    </div>
  );
};

export default Logout;