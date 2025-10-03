import { useEffect, useState } from "react";
import { FaTrophy, FaStar, FaLock, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const AchievementsPage = () => {
	const [achievements, setAchievements] = useState([]);
	const [stats, setStats] = useState({});
	const [loading, setLoading] = useState(true);
	const [checking, setChecking] = useState(false);

	useEffect(() => {
		fetchAchievements();
	}, []);

	const checkForNewAchievements = async () => {
		try {
			setChecking(true);
			const res = await fetch("/api/achievements/check", {
				method: "POST",
				credentials: "include"
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to check achievements");
			}

			toast.success(`Checked achievements! ${data.unlockedAchievements?.length || 0} new unlocked.`);
			
			// Refresh achievements list
			await fetchAchievements();
		} catch (error) {
			console.error("Error checking achievements:", error);
			toast.error(error.message);
		} finally {
			setChecking(false);
		}
	};

	const fetchAchievements = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/achievements", { credentials: "include" });
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to fetch achievements");
			}

			setAchievements(data.achievements || []);
			setStats(data.stats || {});
		} catch (error) {
			console.error("Error fetching achievements:", error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const getRarityColor = (rarity) => {
		switch (rarity) {
			case "common": return "text-gray-400 border-gray-600";
			case "rare": return "text-blue-400 border-blue-600";
			case "epic": return "text-purple-400 border-purple-600";
			case "legendary": return "text-yellow-400 border-yellow-600";
			default: return "text-gray-400 border-gray-600";
		}
	};

	const getCategoryIcon = (category) => {
		switch (category) {
			case "social": return "👥";
			case "exploration": return "🗺️";
			case "special": return "🎯";
			default: return "🏆";
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className='relative overflow-x-auto shadow-md rounded-lg px-4'>
			{/* Header */}
			<div className="mb-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className='text-3xl font-bold text-white mb-2'>Achievements</h1>
						<p className='text-gray-400'>Track your progress and unlock rewards</p>
					</div>
					<button
						onClick={checkForNewAchievements}
						disabled={checking}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
					>
						{checking ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Checking...
							</>
						) : (
							<>
								🔄 Check for New Achievements
							</>
						)}
					</button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<div className="bg-glass p-6 rounded-lg border border-gray-600">
					<div className="flex items-center gap-4">
						<div className="text-4xl">🏆</div>
						<div>
							<p className="text-gray-400 text-sm">Total Unlocked</p>
							<p className="text-white text-2xl font-bold">{stats.totalUnlocked || 0}</p>
						</div>
					</div>
				</div>

				<div className="bg-glass p-6 rounded-lg border border-gray-600">
					<div className="flex items-center gap-4">
						<div className="text-4xl">⭐</div>
						<div>
							<p className="text-gray-400 text-sm">Total Points</p>
							<p className="text-white text-2xl font-bold">{stats.totalPoints || 0}</p>
						</div>
					</div>
				</div>

				<div className="bg-glass p-6 rounded-lg border border-gray-600">
					<div className="flex items-center gap-4">
						<div className="text-4xl">📊</div>
						<div>
							<p className="text-gray-400 text-sm">Completion Rate</p>
							<p className="text-white text-2xl font-bold">
								{achievements.length > 0 ? Math.round((stats.totalUnlocked / achievements.length) * 100) : 0}%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Achievements Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{achievements.map((achievement) => (
					<div
						key={achievement.id}
						className={`bg-glass rounded-lg border p-6 transition-all duration-300 hover:scale-105 ${
							achievement.unlocked
								? "border-green-500 shadow-lg shadow-green-500/20"
								: "border-gray-600 opacity-75"
						}`}
					>
						<div className="flex items-start justify-between mb-4">
							<div className={`text-4xl ${achievement.unlocked ? "" : "grayscale"}`}>
								{achievement.unlocked ? achievement.icon : "🔒"}
							</div>
							{achievement.unlocked && (
								<div className="bg-green-500 text-white rounded-full p-1">
									<FaCheck size={12} />
								</div>
							)}
						</div>

						<div className="mb-3">
							<h3 className={`text-lg font-semibold mb-1 ${
								achievement.unlocked ? "text-white" : "text-gray-400"
							}`}>
								{achievement.name}
							</h3>
							<p className={`text-sm ${
								achievement.unlocked ? "text-gray-300" : "text-gray-500"
							}`}>
								{achievement.description}
							</p>
						</div>

						<div className="flex items-center justify-between mb-3">
							<span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(achievement.rarity)}`}>
								{achievement.rarity}
							</span>
							<span className="text-xs text-gray-400">
								{getCategoryIcon(achievement.category)} {achievement.category}
							</span>
						</div>

						{achievement.unlocked ? (
							<div className="text-center">
								<div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
									Unlocked! +{achievement.points} points
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-400">Progress</span>
									<span className="text-gray-300">
										{achievement.progress || 0} / {achievement.requiredValue}
									</span>
								</div>
								<div className="w-full bg-gray-700 rounded-full h-2">
									<div
										className="bg-blue-500 h-2 rounded-full transition-all duration-300"
										style={{ width: `${achievement.progressPercent || 0}%` }}
									></div>
								</div>
								<div className="text-center text-xs text-gray-500">
									{Math.round(achievement.progressPercent || 0)}% complete
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{achievements.length === 0 && (
				<div className="text-center py-12">
					<FaTrophy className="mx-auto text-6xl text-gray-600 mb-4" />
					<h3 className="text-xl font-semibold text-gray-400 mb-2">No Achievements Yet</h3>
					<p className="text-gray-500">Start exploring and earning achievements!</p>
				</div>
			)}
		</div>
	);
};

export default AchievementsPage;