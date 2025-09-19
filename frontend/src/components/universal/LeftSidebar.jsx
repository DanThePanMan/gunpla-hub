import React, { useContext, useState } from "react";
import JWTContext from "../../contexts/jwtContext";
import NewPostModal from "./newPost";

const LeftSidebar = ({ samplePosts }) => {
    const { user, setToken, setUser } = useContext(JWTContext);
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <div className="hidden lg:block lg:w-64 xl:w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-4 h-fit">
                {/* Logo & User Profile */}
                <div className="form-card p-4 rounded border">
                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src="/image.png"
                            alt="Gunpla Hub Logo"
                            className="h-8 w-auto"
                        />
                        <h1 className="text-xl font-bold text-slate-100">
                            Gunpla Hub
                        </h1>
                    </div>

                    {/* User Info */}
                    {user ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user.displayName
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                        user.email?.charAt(0).toUpperCase() ||
                                        "U"}
                                </div>
                                <div>
                                    <div className="text-slate-200 font-semibold text-sm">
                                        {user.displayName ||
                                            user.email?.split("@")[0] ||
                                            "User"}
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-400 transition duration-200 text-xs">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="text-slate-400 text-sm mb-3">
                                Please log in to continue
                            </div>
                            <a
                                href="/login"
                                className="btn-primary w-full py-2 rounded text-sm text-center block">
                                Login
                            </a>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div className="form-card p-4 rounded border">
                    <h3 className="text-slate-200 font-semibold mb-3">
                        Navigation
                    </h3>

                    {/* New Post Button */}
                    <button
                        onClick={() => setIsNewPostModalOpen(true)}
                        className="btn-primary w-full mb-3 py-2 rounded text-sm">
                        New Post
                    </button>

                    <nav className="space-y-2">
                        <a
                            href="#"
                            className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded hover:bg-slate-700">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span>Home</span>
                        </a>
                        <a
                            href="#"
                            className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <span>Explore</span>
                        </a>
                        <a
                            href="#"
                            className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span>Profile</span>
                        </a>
                        <a
                            href="#"
                            className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                            </svg>
                            <span>Settings</span>
                        </a>
                    </nav>
                </div>

                {/* Quick Stats */}
                <div className="form-card p-4 rounded border">
                    <h3 className="text-slate-200 font-semibold mb-3">
                        Community Stats
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Builds</span>
                            <span className="text-blue-400 font-semibold">
                                {samplePosts?.length || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Likes</span>
                            <span className="text-green-400 font-semibold">
                                {samplePosts?.reduce(
                                    (total, post) =>
                                        total + (post.likedBy?.length || 0),
                                    0
                                ) || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Comments</span>
                            <span className="text-purple-400 font-semibold">
                                {samplePosts?.reduce(
                                    (total, post) =>
                                        total + (post.comments?.length || 0),
                                    0
                                ) || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Post Modal */}
            <NewPostModal
                isOpen={isNewPostModalOpen}
                onClose={() => setIsNewPostModalOpen(false)}
            />
        </div>
    );
};

export default LeftSidebar;
