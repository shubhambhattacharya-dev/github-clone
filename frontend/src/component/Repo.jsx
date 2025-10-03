import React, { useState } from 'react';
import { FaCodeBranch, FaCopy, FaRegStar, FaCode, FaSave } from "react-icons/fa";
import { FaCodeFork } from "react-icons/fa6";
import { FaChartBar } from "react-icons/fa";
import { formatDate } from "../utils/functions";
import { PROGRAMMING_LANGUAGES } from "../utils/constant";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Repo = ({ repo }) => {
	const { authUser } = useAuthContext();
	const navigate = useNavigate();
	const formattedDate = formatDate(repo.created_at);
	const [isSaved, setIsSaved] = useState(false);

	const handleCloneClick = async (repo) => {
		console.log("Clone clicked for", repo.name);
		try {
			await navigator.clipboard.writeText(repo.clone_url);
			toast.success("Repo URL cloned to clipboard");
		} catch (error) {
			console.error("Clone error:", error);
			toast.error("Clipboard write failed. ");
		}
	};

	const handleSaveClick = async (repo) => {
		console.log("Save clicked for", repo.name);
		if (!authUser) {
			toast.error("Please login to save repositories");
			return;
		}
		try {
			const res = await fetch("/api/saved", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ repoFullName: repo.full_name || `${repo.owner.login}/${repo.name}` }),
			});
			const data = await res.json();
			console.log("Save response:", data);
			if (!res.ok) throw new Error(data.error || "Failed to save repo");
			toast.success(data.message || "Repository saved successfully");
			setIsSaved(true);
		} catch (error) {
			console.error("Save error:", error);
			toast.error(error.message || "Failed to save repository");
		}
	};

	return (
		<li className='mb-10 ms-7'>
			<span
				className='absolute flex items-center justify-center w-6 h-6 bg-blue-100
    rounded-full -start-3 ring-8 ring-white'
			>
				<FaCodeBranch className='w-5 h-5 text-blue-800' />
			</span>
			<div className='flex gap-2 items-center flex-wrap'>
				<a
					href={repo.html_url}
					target='_blank'
					rel='noreferrer'
					className='flex items-center gap-2 text-lg font-semibold'
				>
					{repo.name}
				</a>
				<span
					className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5
        py-0.5 rounded-full flex items-center gap-1'
				>
					<FaRegStar /> {repo.stargazers_count}
				</span>
				<span
					className='bg-purple-100 text-purple-800 text-xs font-medium
         px-2.5 py-0.5 rounded-full flex items-center gap-1'
				>
					<FaCodeFork /> {repo.forks_count}
				</span>
				<span
					onClick={() => handleCloneClick(repo)}
					className='cursor-pointer bg-green-100 text-green-800 text-xs
				    font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1'
				>
					<FaCopy /> Clone
				</span>
				{authUser && !isSaved && (
					<span
						onClick={() => handleSaveClick(repo)}
						className='cursor-pointer bg-blue-100 text-blue-800 text-xs
				    font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1'
					>
						<FaSave /> Save
					</span>
				)}
				{authUser && (
					<span
						onClick={() => navigate(`/analytics/${repo.owner.login}/${repo.name}`)}
						className='cursor-pointer bg-purple-100 text-purple-800 text-xs
				    font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1'
					>
						<FaChartBar /> Analytics
					</span>
				)}
			</div>

			<time
				className='block my-1 text-xs font-normal leading-none
     text-gray-400'
			>
				Released on {formattedDate}
			</time>
			<p className='mb-4 text-base font-normal text-gray-500'>
				{repo.description
					? repo.description.length > 500
						? repo.description.slice(0, 500) + "..."
						: repo.description
					: "No description provided"}
			</p>
			{PROGRAMMING_LANGUAGES[repo.language] ? (
				<img
					src={PROGRAMMING_LANGUAGES[repo.language]}
					alt='Programming language icon'
					className='h-8 w-8'
				/>
			) : (
				<FaCode className='h-8 w-8 text-gray-400' />
			)}
		</li>
	);
};
export default Repo;
