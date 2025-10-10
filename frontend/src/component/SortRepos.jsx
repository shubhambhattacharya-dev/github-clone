const SortRepos = ({ onSort, sortType }) => {
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "stars", label: "Most Stars" },
    { value: "forks", label: "Most Forks" },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">Sort by:</span>
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSort(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortType === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortRepos;