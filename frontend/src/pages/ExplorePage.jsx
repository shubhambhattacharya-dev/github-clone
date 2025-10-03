import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../component/Spinner";
import Repos from "../component/Repos";

// Configuration for language logos
const LANGUAGE_LOGOS = [
  { src: "/javascript.svg", alt: "JavaScript", language: "javascript" },
  { src: "/typescript.svg", alt: "TypeScript", language: "typescript" },
  { src: "/c++.svg", alt: "C++", language: "c++" },
  { src: "/python.svg", alt: "Python", language: "python" },
  { src: "/java.svg", alt: "Java", language: "java" }
];

const API_URL = "/api/explore";

const ExplorePage = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const exploreRepos = async (language) => {
    if (language === selectedLanguage) return; // Prevent duplicate requests

    setLoading(true);
    setRepos([]);

    try {
      const response = await fetch(`${API_URL}/${language}`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`API Error: ${error.message}`);
      }

      const { repos } = await response.json();
      if (!repos?.length) throw new Error(`No ${language} repositories found`);

      setRepos(repos);
      setSelectedLanguage(language);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="bg-glass max-w-2xl mx-auto rounded-md p-4">
        <h1 className="text-xl font-bold text-center mb-4">
          Explore Popular Repositories
        </h1>

        <div className="flex flex-wrap gap-2 my-2 justify-center">
          {LANGUAGE_LOGOS.map(({ src, alt, language }) => (
            <button
              key={language}
              onClick={() => exploreRepos(language)}
              className="hover:opacity-75 transition-opacity"
              aria-label={`Explore ${alt} repositories`}
            >
              <img
                src={src}
                alt={alt}
                className="h-11 sm:h-20"
                title={`Explore ${alt} repositories`}
              />
            </button>
          ))}
        </div>

        {repos.length > 0 && (
          <h2 className="text-lg font-semibold text-center my-4">
            <span className="bg-blue-100 text-blue-800 font-medium me-2 px-2.5 py-0.5 rounded-full">
              {(selectedLanguage || "Unknown").toUpperCase()}
            </span>
            Repositories
          </h2>
        )}

        {loading ? (
          <div className="text-center">
            <Spinner />
            <p className="mt-2 text-gray-600">Fetching {selectedLanguage} repositories...</p>
          </div>
        ) : (
          <Repos repos={repos} />
        )}
      </div>
    </div>
  );
};

export default ExplorePage;