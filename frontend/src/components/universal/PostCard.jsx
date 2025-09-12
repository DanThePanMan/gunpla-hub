import React, { useState } from "react";

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likedBy?.length || 0);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="form-card p-6 rounded-xl shadow-lg backdrop-blur-sm">
            {/* Post Header */}
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.author.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                    <h3 className="text-slate-200 font-semibold">
                        {post.author.displayName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                        {formatDate(post.createdAt)}
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-100 mb-2">
                    {post.title}
                </h2>
                <p className="text-slate-300 leading-relaxed">{post.content}</p>
            </div>

            {/* Build Info (if exists) */}
            {post.build && (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
                    <div className="flex items-center mb-2">
                        <svg
                            className="w-5 h-5 text-blue-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        <span className="text-blue-400 font-medium text-sm">
                            Gunpla Build
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-400">Kit:</span>
                            <span className="text-slate-200 ml-2">
                                {post.build.kitName}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400">Grade:</span>
                            <span className="text-slate-200 ml-2">
                                {post.build.grade}
                            </span>
                        </div>
                        {post.build.difficulty && (
                            <div>
                                <span className="text-slate-400">
                                    Difficulty:
                                </span>
                                <span className="text-slate-200 ml-2">
                                    {post.build.difficulty}/10
                                </span>
                            </div>
                        )}
                    </div>
                    {post.build.customizations && (
                        <div className="mt-2">
                            <span className="text-slate-400 text-sm">
                                Customizations:
                            </span>
                            <p className="text-slate-300 text-sm mt-1">
                                {post.build.customizations}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 transition duration-200 ${
                            liked
                                ? "text-red-400"
                                : "text-slate-400 hover:text-red-400"
                        }`}>
                        <svg
                            className="w-5 h-5"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span className="text-sm">{likeCount}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition duration-200">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="text-sm">
                            {post.comments?.length || 0}
                        </span>
                    </button>

                    <button className="flex items-center space-x-2 text-slate-400 hover:text-green-400 transition duration-200">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                        </svg>
                        <span className="text-sm">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
