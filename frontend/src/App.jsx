import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ExplorePage = lazy(() => import("./pages/ExplorePage.jsx"));
const LikesPage = lazy(() => import("./pages/LikesPage.jsx"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard.jsx"));
const SavedPage = lazy(() => import("./pages/SavedPage.jsx"));
const StarredPage = lazy(() => import("./pages/StarredPage.jsx"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage.jsx"));
const ContributionArtPage = lazy(() => import("./pages/ContributionArtPage.jsx"));
const TrendsPage = lazy(() => import("./pages/TrendsPage.jsx"));
const PlacementPage = lazy(() => import("./pages/PlacementPage.jsx"));
const HackathonOSPage = lazy(() => import("./pages/HackathonOSPage.jsx"));
const TodoPage = lazy(() => import("./pages/TodoPage.jsx"));

import Sidebar from "./component/Sidebar.jsx";
import Spinner from "./component/Spinner.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";

function App() {
  const { authUser, loading } = useAuthContext();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );

  return (
    <div className="flex">
      {authUser && <Sidebar />}
      <div
        id="main"
        className={`max-w-5xl my-5 text-white mx-auto transition-all duration-300 flex-1 ${authUser ? '' : 'max-w-none'}`}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Spinner />
          </div>
        }>
          <Routes>
             <Route path="/" element={<HomePage />} />
              <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/signup" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
              <Route path="/likes" element={authUser ? <LikesPage /> : <Navigate to="/login" />} />
              <Route path="/analytics/:owner/:repo" element={authUser ? <AnalyticsDashboard /> : <Navigate to="/login" />} />
              <Route path="/analytics" element={authUser ? <AnalyticsDashboard /> : <Navigate to="/login" />} />
              <Route path="/saved" element={authUser ? <SavedPage /> : <Navigate to="/login" />} />
              <Route path="/starred" element={authUser ? <StarredPage /> : <Navigate to="/login" />} />
              <Route path="/achievements" element={authUser ? <AchievementsPage /> : <Navigate to="/login" />} />
              <Route path="/contribution-art" element={authUser ? <ContributionArtPage /> : <Navigate to="/login" />} />
              <Route path="/trends" element={authUser ? <TrendsPage /> : <Navigate to="/login" />} />
              <Route path="/placement" element={authUser ? <PlacementPage /> : <Navigate to="/login" />} />
              <Route path="/hackathon-os" element={authUser ? <HackathonOSPage /> : <Navigate to="/login" />} />
              <Route path="/todo" element={authUser ? <TodoPage /> : <Navigate to="/login" />} />
            </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;
