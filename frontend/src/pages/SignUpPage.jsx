import { FaGithub, FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const handleLoginWithGithub = () => {
    window.open("/api/auth/github", "_self");
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-glass">
        <div className="p-6 space-y-6 sm:p-8">
          <h1 className="text-xl font-bold md:text-2xl text-center">Create Account</h1>

          <button
            type="button"
            className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4
            focus:ring-[#24292F]/50 font-medium rounded-lg flex gap-2 p-2 items-center w-full 
            text-center justify-center"
            onClick={handleLoginWithGithub}
          >
            <FaGithub className="w-5 h-5" />
            Sign up with Github
          </button>

          <p className="text-gray-300 text-center">
            By signing up, you will unlock all the features of the app.
            <FaUnlockAlt className="w-4 h-4 inline mx-2" />
          </p>

          <p className="text-sm font-light text-gray-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:underline text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
