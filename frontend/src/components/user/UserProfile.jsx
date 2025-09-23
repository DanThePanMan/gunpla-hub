import React from "react";

export default function UserProfile({ user, totalPosts }) {
    if (!user) return null;

    return (
        <div className="bg-slate-800 p-4 rounded border border-slate-700 mb-4">
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl"
                    style={{ background: "var(--primary)" }}>
                    {user.displayName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                    <div className="text-slate-100 text-lg font-bold">
                        {user.displayName}
                    </div>
                    <div className="text-slate-400 text-sm">{user.email}</div>
                    <div className="text-slate-400 text-sm mt-1">
                        {totalPosts ?? 0} posts
                    </div>
                </div>
            </div>
        </div>
    );
}
