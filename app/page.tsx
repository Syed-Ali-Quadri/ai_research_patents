'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or handle search
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            SmartTech
          </h1>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-800">
            Forecast Engine
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Discover patents and innovations powered by AI
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              <Search className="absolute left-6 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patents, technologies, or innovations..."
                className="w-full py-4 px-14 bg-transparent outline-none text-gray-800 placeholder-gray-400 rounded-full text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={() => router.push('/trending')}
            className="px-6 py-2.5 bg-white text-gray-700 rounded-full shadow hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-300"
          >
            🔥 Trending Patents
          </button>
          <button
            onClick={() => router.push('/ai-insights')}
            className="px-6 py-2.5 bg-white text-gray-700 rounded-full shadow hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-300"
          >
            🤖 AI Insights
          </button>
          <button
            onClick={() => router.push('/explore')}
            className="px-6 py-2.5 bg-white text-gray-700 rounded-full shadow hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-300"
          >
            🚀 Explore Tech
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-sm text-gray-500">
        <p>Powered by AI • Smart Patent Discovery</p>
      </div>
    </div>
  );
};

export default Home;