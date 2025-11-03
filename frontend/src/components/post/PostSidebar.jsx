import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostSidebar({ post, isAuthor, onDelete }) {
    const navigate = useNavigate();

    return (
        <div className="card bg-base-200 border border-base-300 p-6 ">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-sm hover:bg-slate-700 transition-colors ease-in-out">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-primary font-semibold"
                    style={{ background: "var(--primary)" }}>
                    {post.author.displayName?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="text-primary font-semibold">
                        {post.author.displayName}
                    </div>
                    <div className="text-primary text-sm">
                        {new Date(post.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            <h1 className="text-xl font-bold text-primary mb-2">
                {post.title}
            </h1>
            <p className="text-primary mb-4 white-space-pre-wrap">
                {post.content}
            </p>

            {post.build && (
                <div className="card bg-base-200 border border-base-300 p-6 ">
                    <div className="text-accent font-medium mb-2">
                        Gunpla Build
                    </div>
                    <div className="text-sm text-primary">
                        {post.build.kitName} —{" "}
                        <span className="text-slate-400">
                            {post.build.grade}
                        </span>
                    </div>
                    {post.build.difficulty && (
                        <div className="text-slate-400 text-sm mt-1">
                            Difficulty:{" "}
                            <span className="text-slate-200">
                                {post.build.difficulty}/10
                            </span>
                        </div>
                    )}
                    {post.build.customizations && (
                        <div className="mt-2 text-slate-300 text-sm">
                            {post.build.customizations}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <div className="text-slate-400 text-sm">
                    {post._count?.likedBy || 0} likes •{" "}
                    {post._count?.comments || 0} comments
                </div>
                <div className="flex gap-2">
                    {isAuthor && (
                        <>
                            <button
                                onClick={() => navigate(`/Home`)}
                                className="btn btn-accent">
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="btn btn-secondary">
                                Delete
                            </button>
                        </>
                    )}
                    <button
                        onClick={() =>
                            navigator.share?.({
                                title: post.title,
                                url: window.location.href,
                            })
                        }
                        className="btn btn-primary">
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
