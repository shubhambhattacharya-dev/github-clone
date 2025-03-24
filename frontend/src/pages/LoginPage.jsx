import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 bg-glass">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 sm:max-w-sm md:mt-0 xl:p-0">
        <div className="p-6 space-y-8 sm:p-8">
          <div className="flex flex-col items-center gap-4">
            <FaGithub className="w-12 h-12 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Log in to GitHub
            </h1>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              className="w-full text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 
              focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 
              text-center inline-flex items-center justify-center gap-3"
            >
              <FaGithub className="w-5 h-5" />
              Log in with GitHub
            </button>

            <div className="text-sm text-center text-gray-500 border-t border-gray-200 pt-6">
              <p className="mb-2">New to GitHub?</p>
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
