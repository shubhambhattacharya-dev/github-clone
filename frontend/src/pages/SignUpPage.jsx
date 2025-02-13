import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log({ username, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-800/40 backdrop-blur-2xl border-2 border-white/15 rounded-xl shadow-[0_0_35px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_0_45px_-5px_rgba(59,130,246,0.4)] transition-all duration-300">
        <div className="p-8 space-y-6">
          {/* GitHub Logo */}
          <div className="flex justify-center">
            <svg
              height="32"
              viewBox="0 0 16 16"
              width="32"
              className="text-gray-100 hover:text-white transition-colors"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-100 hover:text-white transition-colors">
            Sign up for GitHub
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-700/30 backdrop-blur-sm border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 text-gray-100 transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-700/30 backdrop-blur-sm border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 text-gray-100 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-700/30 backdrop-blur-sm border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 text-gray-100 transition-all"
                placeholder="Create a password"
                required
              />
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Make sure it's at least 15 characters OR at least 8 characters
                including a number and a lowercase letter.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600/90 hover:bg-green-700/90 text-white rounded-lg transition-all backdrop-blur-sm border border-green-400/30 shadow-md hover:shadow-lg hover:border-green-400/50 font-medium"
            >
              Create account
            </button>
          </form>

          {/* Legal Text */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              By creating an account, you agree to the{' '}
              <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                Terms of Service
              </Link>
              . For more information about GitHub's privacy practices, see the{' '}
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                Privacy Statement
              </Link>
              .
            </p>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-gray-400 p-4 bg-gray-800/20 backdrop-blur-sm rounded-lg">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;