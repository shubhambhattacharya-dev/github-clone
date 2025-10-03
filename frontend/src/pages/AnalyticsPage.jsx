import { useEffect, useState } from "react";
import { FaHeart, FaBookmark, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

const AnalyticsPage = () => {
	const [analytics, setAnalytics] = useState(null);

	useEffect(() => {
		const getAnalytics = async () => {
			try {
				const res = await fetch("/api/analytics", { credentials: "include" });
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				setAnalytics(data.analytics);
			} catch (error) {
				toast.error(error.message);
			}
		};
		getAnalytics();
	}, []);

	if (!analytics) {
		return <div className="text-center py-8">Loading analytics...</div>;
	}

	return (
		<div className='relative overflow-x-auto shadow-md rounded-lg px-4'>
			<h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-glass p-6 rounded-lg shadow-md">
					<div className="flex items-center">
						<FaHeart className="text-red-500 text-3xl mr-4" />
						<div>
							<h2 className="text-lg font-semibold">Likes Received</h2>
							<p className="text-2xl font-bold">{analytics.totalLikesReceived}</p>
						</div>
					</div>
				</div>
				<div className="bg-glass p-6 rounded-lg shadow-md">
					<div className="flex items-center">
						<FaBookmark className="text-blue-500 text-3xl mr-4" />
						<div>
							<h2 className="text-lg font-semibold">Saved Repositories</h2>
							<p className="text-2xl font-bold">{analytics.totalSavedRepos}</p>
						</div>
					</div>
				</div>
				<div className="bg-glass p-6 rounded-lg shadow-md">
					<div className="flex items-center">
						<FaUser className="text-green-500 text-3xl mr-4" />
						<div>
							<h2 className="text-lg font-semibold">Likes Given</h2>
							<p className="text-2xl font-bold">{analytics.totalLikesGiven}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;