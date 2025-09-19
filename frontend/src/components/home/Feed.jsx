import React from "react";
import PostCard from "../universal/PostCard";

const Feed = ({ posts, loading }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="form-card p-4 rounded border mb-4 animate-pulse">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                            <div className="ml-3">
                                <div className="h-4 bg-slate-600 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-slate-700 rounded w-16"></div>
                            </div>
                        </div>
                        <div className="h-5 bg-slate-600 rounded mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded mb-1"></div>
                        <div className="h-4 bg-slate-700 rounded mb-1"></div>
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="py-8 text-center">
                <div className="bg-slate-800 rounded p-6 border border-slate-700">
                    <svg
                        className="w-12 h-12 text-slate-500 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        No posts yet
                    </h3>
                    <p className="text-slate-400 mb-4">
                        Be the first to share your Gunpla builds with the
                        community!
                    </p>
                    <button className="btn-primary px-4 py-2 rounded font-medium">
                        Create Your First Post
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;
