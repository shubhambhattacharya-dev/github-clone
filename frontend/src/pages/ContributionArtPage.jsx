import React, { useState, useEffect } from 'react';
import { Calendar, Download, Save, Palette, Github, Puzzle, Upload, Target, Trophy, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ContributionArtPage = () => {
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [newPuzzle, setNewPuzzle] = useState({
    imageName: '',
    targetImage: '',
    totalCommitsRequired: 365,
    commitsPerDay: 1,
    puzzleType: 'combined', // Changed from 'image' to 'combined'
    repository: null
  });
  const [userRepos, setUserRepos] = useState([]);
  const [editingPuzzle, setEditingPuzzle] = useState(null);
  const [imagePieces, setImagePieces] = useState({});


  // Puzzle functions
  const loadUserPuzzles = async () => {
    try {
      const response = await fetch('/api/contribution-art/puzzles/current-user');
      const data = await response.json();
      if (data.success) {
        setPuzzles(data.data);
      }
    } catch (error) {
      console.error('Error loading puzzles:', error);
    }
  };

  const loadUserRepos = async () => {
    try {
      // First try to get the logged-in user's repositories
      const userProfileResponse = await fetch('/api/auth/check', {
        credentials: 'include'
      });

      if (userProfileResponse.ok) {
        const userData = await userProfileResponse.json();
        if (userData.user && userData.user.username) {
          const username = userData.user.username;

          // Get user's repositories from GitHub API
          const reposResponse = await fetch(`/api/users/profile/${username}`);
          if (reposResponse.ok) {
            const data = await reposResponse.json();
            if (data.repos && Array.isArray(data.repos)) {
              // Transform to the format we need
              const transformedRepos = data.repos.slice(0, 20).map(repo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                html_url: repo.html_url
              }));

              setUserRepos(transformedRepos);
              console.log('Loaded user repos:', transformedRepos.length);
              return;
            }
          }
        }
      }

      // Fallback: Get popular repos from different languages for selection
      const languages = ['javascript', 'python', 'java', 'typescript'];
      const allRepos = [];

      for (const lang of languages) {
        try {
          const response = await fetch(`/api/explore/${lang}`);
          const data = await response.json();
          if (data.repos && Array.isArray(data.repos)) {
            // Transform and add to collection
            const transformed = data.repos.slice(0, 5).map(repo => ({
              id: repo.id,
              name: repo.name,
              full_name: repo.full_name,
              description: repo.description,
              language: repo.language,
              stargazers_count: repo.stargazers_count,
              html_url: repo.html_url
            }));
            allRepos.push(...transformed);
          }
        } catch (langError) {
          console.error(`Error loading ${lang} repos:`, langError);
        }
      }

      // Remove duplicates and limit to 20 repos
      const uniqueRepos = allRepos.filter((repo, index, self) =>
        index === self.findIndex(r => r.id === repo.id)
      ).slice(0, 20);

      setUserRepos(uniqueRepos);
      console.log('Loaded fallback repos:', uniqueRepos.length);
    } catch (error) {
      console.error('Error loading repos:', error);
      // Fallback: provide some sample repos
      setUserRepos([
        {
          id: 1,
          name: 'sample-repo',
          full_name: 'user/sample-repo',
          description: 'A sample repository for testing',
          language: 'JavaScript',
          stargazers_count: 42,
          html_url: 'https://github.com/user/sample-repo'
        }
      ]);
    }
  };

  const createPuzzle = async () => {
    console.log('Creating puzzle with data:', newPuzzle);

    if (!newPuzzle.imageName) {
      toast.error('Please enter a puzzle name');
      return;
    }

    if (!newPuzzle.targetImage && !newPuzzle.repository) {
      toast.error('Please upload an image or select a repository');
      return;
    }

    try {
      const payload = {
        userId: 'current-user',
        username: 'current-user',
        ...newPuzzle
      };

      console.log('Sending payload:', payload);

      const response = await fetch('/api/contribution-art/puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast.success('Puzzle created successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        });
        setPuzzles([...puzzles, data.data]);
        setNewPuzzle({
          imageName: '',
          targetImage: '',
          totalCommitsRequired: 365,
          commitsPerDay: 1,
          puzzleType: 'combined',
          repository: null
        });
      } else {
        toast.error(data.error || 'Failed to create puzzle', {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        });
      }
    } catch (error) {
      console.error('Error creating puzzle:', error);
      toast.error('Failed to create puzzle');
    }
  };

  const updatePuzzleProgress = async (puzzleId, newCommits) => {
    try {
      const response = await fetch(`/api/contribution-art/puzzle/${puzzleId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCommits: newCommits })
      });

      const data = await response.json();
      if (data.success) {
        const updatedPuzzle = data.data;
        setPuzzles(puzzles.map(p => p._id === puzzleId ? updatedPuzzle : p));

        if (updatedPuzzle.isCompleted && !selectedPuzzle?.isCompleted) {
          // Array of motivational completion messages
          const completionMessages = [
            '🎉 Amazing! You did it! So proud of your dedication! 🌟',
            '🏆 Congratulations! Your hard work paid off beautifully! 💪',
            '🎊 Fantastic achievement! You\'re unstoppable! 🚀',
            '🌈 Wow! You completed your challenge! So inspiring! ✨',
            '🎯 Mission accomplished! Your commitment is incredible! 🏅',
            '💫 Brilliant work! You\'ve earned every bit of this success! 🌟',
            '🎨 Masterpiece completed! Your creativity shines through! 🎨',
            '🔥 You\'re on fire! This completion is just the beginning! 🔥',
            '💎 Precious achievement! Your perseverance is golden! ✨',
            '🚀 To the moon and back! Your dedication launched you there! 🌙'
          ];

          const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];

          toast.success(randomMessage, {
            duration: 8000,
            icon: '🎉',
            style: {
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #047857',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
            }
          });

          // Show achievement unlock
          setTimeout(() => {
            toast.success('🏆 Achievement Unlocked: Puzzle Master!', {
              duration: 6000,
              icon: '🏆',
              style: {
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }
            });
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const autoDetectCommits = async () => {
    try {
      const response = await fetch('/api/contribution-art/auto-detect-commits/current-user', {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        // Update puzzles with new data
        if (data.updatedPuzzles && data.updatedPuzzles.length > 0) {
          setPuzzles(puzzles.map(puzzle => {
            const updated = data.updatedPuzzles.find(up => up._id === puzzle._id);
            return updated || puzzle;
          }));

          toast.success(`✅ Auto-detected commits! Updated ${data.updatedPuzzles.length} puzzle(s)`, {
            duration: 4000,
            style: {
              background: '#3B82F6',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          });
        } else {
          toast.success('No new commits detected', {
            duration: 3000,
            style: {
              background: '#6B7280',
              color: 'white',
              fontSize: '14px'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error auto-detecting commits:', error);
      toast.error('Failed to auto-detect commits', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPuzzle({ ...newPuzzle, targetImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateProgress = (puzzle) => {
    if (!puzzle) return { percentage: 0, remainingCommits: 0, remainingDays: 0 };

    const totalCommitsRequired = puzzle.totalCommitsRequired || 1;
    const currentCommits = puzzle.currentCommits || 0;
    const commitsPerDay = puzzle.commitsPerDay || 1;

    const percentage = totalCommitsRequired > 0
      ? Math.min(100, (currentCommits / totalCommitsRequired) * 100)
      : 0;

    const remainingCommits = Math.max(0, totalCommitsRequired - currentCommits);
    const remainingDays = commitsPerDay > 0
      ? Math.ceil(remainingCommits / commitsPerDay)
      : 0;

    return {
      percentage: isNaN(percentage) ? 0 : percentage,
      remainingCommits: isNaN(remainingCommits) ? 0 : remainingCommits,
      remainingDays: isNaN(remainingDays) ? 0 : remainingDays
    };
  };

  const generatePuzzlePieces = (puzzle) => {
    if (!puzzle || puzzle.puzzleType !== 'image' || !puzzle.targetImage) {
      return [];
    }

    const progress = calculateProgress(puzzle);
    const totalPieces = 20; // 4x5 grid
    const revealedPieces = Math.floor((progress.percentage / 100) * totalPieces);

    const pieces = [];
    for (let i = 0; i < totalPieces; i++) {
      pieces.push({
        id: i,
        revealed: i < revealedPieces,
        row: Math.floor(i / 5),
        col: i % 5
      });
    }

    return pieces;
  };

  const deletePuzzle = async (puzzleId) => {
    if (!confirm('Are you sure you want to delete this puzzle?')) return;

    try {
      const response = await fetch(`/api/contribution-art/puzzle/${puzzleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPuzzles(puzzles.filter(p => p._id !== puzzleId));
        toast.success('Puzzle deleted successfully');
      } else {
        toast.error('Failed to delete puzzle');
      }
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      toast.error('Failed to delete puzzle');
    }
  };

  const extendPuzzleDeadline = async (puzzleId) => {
    try {
      const response = await fetch(`/api/contribution-art/puzzle/${puzzleId}/extend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extendDays: 30 }) // Extend by 30 days
      });

      const data = await response.json();
      if (data.success) {
        setPuzzles(puzzles.map(p =>
          p._id === puzzleId
            ? data.data
            : p
        ));

        const encouragementMessages = [
          '💪 You got this! 30 more days to shine! 🌟',
          '🔄 Fresh start! Keep pushing forward! 🚀',
          '⏰ Time extended! Your dedication will pay off! 💎',
          '🎯 Another chance! You\'re capable of amazing things! ✨',
          '🌱 Growth takes time! Keep nurturing your goals! 🌿'
        ];

        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

        toast.success(randomMessage, {
          duration: 6000,
          icon: '⏰',
          style: {
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        });
      } else {
        toast.error('Failed to extend deadline');
      }
    } catch (error) {
      console.error('Error extending deadline:', error);
      toast.error('Failed to extend deadline');
    }
  };

  const startEditing = (puzzle) => {
    setEditingPuzzle({
      ...puzzle,
      imageName: puzzle.imageName,
      totalCommitsRequired: puzzle.totalCommitsRequired,
      commitsPerDay: puzzle.commitsPerDay
    });
  };

  const cancelEditing = () => {
    setEditingPuzzle(null);
  };

  const saveEditedPuzzle = async () => {
    if (!editingPuzzle) return;

    try {
      const response = await fetch(`/api/contribution-art/puzzle/${editingPuzzle._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageName: editingPuzzle.imageName,
          totalCommitsRequired: editingPuzzle.totalCommitsRequired,
          commitsPerDay: editingPuzzle.commitsPerDay
        })
      });

      const data = await response.json();
      if (data.success) {
        setPuzzles(puzzles.map(p =>
          p._id === editingPuzzle._id
            ? data.data
            : p
        ));
        setEditingPuzzle(null);
        toast.success('Puzzle updated successfully');
      } else {
        toast.error('Failed to update puzzle');
      }
    } catch (error) {
      console.error('Error updating puzzle:', error);
      toast.error('Failed to update puzzle');
    }
  };

  useEffect(() => {
    loadUserPuzzles();
    loadUserRepos();
  }, []);

  const ContributionGrid = () => {
    if (!contributions || contributions.length === 0) return null;

    // Implementation based on CSS Grid layout
    return (
      <div className="contribution-art-container">
        <svg
          id="contribution-art"
          width="140"
          height="600"
          className={`transition-all duration-300 ${artConfig.animation ? 'hover:scale-105' : ''}`}
        >
          {/* Month labels */}
          {artConfig.showLabels && (
            <g className="month-labels" fontSize="10" fill="#57606a">
              {/* Month labels implementation */}
            </g>
          )}

          {/* Contribution squares */}
          <g transform="translate(30, 30)">
            {contributions.slice(0, 365).map((contribution, index) => {
              const row = Math.floor(index / 7);
              const col = index % 7;
              const color = themes[artConfig.theme][contribution.level] || themes[artConfig.theme][0];

              return (
                <rect
                  key={index}
                  x={col * 14}
                  y={row * 14}
                  width="10"
                  height="10"
                  fill={color}
                  rx="2"
                  ry="2"
                  className="transition-colors duration-200 hover:stroke-2 hover:stroke-blue-400"
                >
                  <title>
                    {contribution.count} contributions on {new Date(contribution.date).toLocaleDateString()}
                  </title>
                </rect>
              );
            })}
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className="px-4">
      <div className="bg-glass max-w-6xl mx-auto rounded-md p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Puzzle className="w-10 h-10 mr-3" />
            <h1 className="text-2xl font-bold">
              GitHub Puzzle Challenges
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create and complete coding challenges based on your GitHub contributions
          </p>
        </div>

        {/* Puzzle Challenges Content */}
          // Puzzle Challenges Tab
          <div className="space-y-6">
            {/* Create New Puzzle */}
            <div className="bg-glass rounded-md p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Create New Puzzle Challenge
              </h3>

              {/* Combined Puzzle Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Puzzle Challenge Options</label>
                <p className="text-xs text-gray-500 mb-3">Choose an image to reveal or a repository to complete</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Puzzle Name</label>
                  <input
                    type="text"
                    value={newPuzzle.imageName}
                    onChange={(e) => setNewPuzzle({ ...newPuzzle, imageName: e.target.value })}
                    placeholder="Name your challenge"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Commits</label>
                  <input
                    type="number"
                    value={newPuzzle.totalCommitsRequired}
                    onChange={(e) => setNewPuzzle({ ...newPuzzle, totalCommitsRequired: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Commits Per Day</label>
                  <input
                    type="number"
                    value={newPuzzle.commitsPerDay}
                    onChange={(e) => setNewPuzzle({ ...newPuzzle, commitsPerDay: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Upload Target Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload an image to reveal as you progress</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Select Repository (Optional)</label>
                  <select
                    value={newPuzzle.repository?.full_name || ''}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      console.log('Selected repository:', selectedValue);
                      if (!selectedValue) {
                        setNewPuzzle({ ...newPuzzle, repository: null });
                        return;
                      }
                      const repo = userRepos.find(r => r.full_name === selectedValue);
                      console.log('Found repo:', repo);
                      if (repo) {
                        setNewPuzzle({ ...newPuzzle, repository: repo });
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="">Choose a repository to track...</option>
                    {userRepos.map(repo => (
                      <option key={repo.id || repo.full_name} value={repo.full_name}>
                        {repo.name} ({repo.language || 'No language'}) ⭐{repo.stargazers_count || 0}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select a repository to auto-track commits</p>
                </div>
              </div>

              {/* Preview */}
              {(newPuzzle.targetImage || newPuzzle.repository) && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="flex gap-4 flex-wrap">
                    {newPuzzle.targetImage && (
                      <div className="flex flex-col items-center">
                        <img
                          src={newPuzzle.targetImage}
                          alt="Puzzle preview"
                          className="max-w-xs max-h-32 object-contain border border-gray-600 rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">Target Image</p>
                      </div>
                    )}
                    {newPuzzle.repository && (
                      <div className="bg-glass p-3 rounded-md max-w-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <Github className="w-4 h-4" />
                          <span className="font-medium">{newPuzzle.repository.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{newPuzzle.repository.description}</p>
                        <p className="text-xs text-gray-500">⭐ {newPuzzle.repository.stargazers_count} stars</p>
                        <p className="text-xs text-blue-400 mt-1">Auto-commit tracking</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={createPuzzle}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Create Puzzle
              </button>
            </div>

            {/* Active Puzzles */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Your Puzzle Challenges
                </h3>
                <button
                  onClick={autoDetectCommits}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Auto-Detect Commits
                </button>
              </div>

              {puzzles.length === 0 ? (
                <div className="text-center py-8 bg-glass rounded-md">
                  <Puzzle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-600">No puzzles yet. Create your first challenge!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {puzzles.map((puzzle) => {
                    const progress = calculateProgress(puzzle);
                    return (
                      <div key={puzzle._id} className="bg-glass rounded-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold">{puzzle.imageName}</h4>
                          {puzzle.isCompleted && (
                            <Trophy className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>

                        {puzzle.puzzleType === 'image' ? (
                          <div className="relative mb-3">
                            <img
                              src={puzzle.targetImage}
                              alt={puzzle.imageName}
                              className="w-full h-32 object-cover rounded-md"
                            />
                            {/* Puzzle Pieces Overlay */}
                            {!puzzle.isCompleted && (
                              <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 rounded-md overflow-hidden">
                                {generatePuzzlePieces(puzzle).map((piece) => (
                                  <div
                                    key={piece.id}
                                    className="relative transition-all duration-500"
                                    style={{
                                      border: piece.revealed ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                      backgroundColor: piece.revealed ? 'transparent' : 'rgba(31, 41, 55, 0.8)',
                                      backdropFilter: piece.revealed ? 'none' : 'blur(2px)'
                                    }}
                                  >
                                    {piece.revealed ? (
                                      // Show actual image piece
                                      <div
                                        className="w-full h-full bg-cover bg-no-repeat"
                                        style={{
                                          backgroundImage: `url(${puzzle.targetImage})`,
                                          backgroundPosition: `${piece.col * 20}% ${piece.row * 25}%`,
                                          backgroundSize: '500% 400%' // 5x4 grid scaling
                                        }}
                                      />
                                    ) : (
                                      // Show lock symbol for unrevealed pieces
                                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-800/60">
                                        🔒
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {puzzle.isCompleted && (
                              <div className="absolute inset-0 bg-green-500/20 rounded-md flex items-center justify-center">
                                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  ✅ Completed!
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`bg-gray-800 p-3 rounded-md mb-3 ${puzzle.isCompleted ? 'border-2 border-green-500' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Github className="w-4 h-4" />
                              <span className="font-medium">{puzzle.repository?.name || 'Repository'}</span>
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded ml-2">AUTO-DETECT</span>
                              {puzzle.isCompleted && <Trophy className="w-4 h-4 text-yellow-500 ml-auto" />}
                            </div>
                            <p className="text-sm text-gray-400 mb-1">
                              {puzzle.repository?.description || 'Complete this repository goal'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>⭐ {puzzle.repository?.stargazers_count || 0}</span>
                              <span>{puzzle.repository?.language || 'Code'}</span>
                            </div>
                            <div className="mt-2 text-blue-400 text-xs">
                              🔄 Commits auto-detected from GitHub
                            </div>
                            {puzzle.isCompleted && (
                              <div className="mt-2 text-green-400 text-sm font-medium">
                                🎉 Repository goal achieved!
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(progress.percentage)}%</span>
                          </div>

                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Commits:</span>
                              <div className="font-medium">
                                {puzzle.currentCommits} / {puzzle.totalCommitsRequired}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Remaining:</span>
                              <div className="font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {progress.remainingDays} days
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                             {!puzzle.isCompleted && puzzle.puzzleType === 'image' && (
                               <button
                                 onClick={() => updatePuzzleProgress(puzzle._id, puzzle.currentCommits + 1)}
                                 className="flex-1 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
                               >
                                 Add Commit (+1)
                               </button>
                             )}

                             {!puzzle.isCompleted && puzzle.puzzleType === 'repository' && (
                               <div className="flex-1 text-center py-2 bg-blue-600/20 text-blue-400 rounded-md font-medium text-sm border border-blue-600/30">
                                 🔄 Auto-Detecting Commits
                               </div>
                             )}

                             {puzzle.isCompleted && (
                               <div className="flex-1 text-center py-2 bg-green-600 text-white rounded-md font-medium text-sm">
                                 🎉 Completed!
                               </div>
                             )}

                             <button
                               onClick={() => startEditing(puzzle)}
                               className="px-3 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors text-sm"
                               title="Edit Puzzle"
                             >
                               ✏️
                             </button>

                             {!puzzle.isCompleted && (
                               <button
                                 onClick={() => extendPuzzleDeadline(puzzle._id)}
                                 className="px-3 py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors text-sm"
                                 title="Extend Deadline (+30 days)"
                               >
                                 ⏰
                               </button>
                             )}

                             <button
                               onClick={() => deletePuzzle(puzzle._id)}
                               className="px-3 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors text-sm"
                               title="Delete Puzzle"
                             >
                               🗑️
                             </button>
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

       {/* Edit Puzzle Modal */}
        {editingPuzzle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-glass rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Edit Puzzle</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Puzzle Name</label>
                  <input
                    type="text"
                    value={editingPuzzle.imageName}
                    onChange={(e) => setEditingPuzzle({ ...editingPuzzle, imageName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Commits</label>
                  <input
                    type="number"
                    value={editingPuzzle.totalCommitsRequired}
                    onChange={(e) => setEditingPuzzle({ ...editingPuzzle, totalCommitsRequired: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Commits Per Day</label>
                  <input
                    type="number"
                    value={editingPuzzle.commitsPerDay}
                    onChange={(e) => setEditingPuzzle({ ...editingPuzzle, commitsPerDay: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEditedPuzzle}
                  className="flex-1 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEditing}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionArtPage;