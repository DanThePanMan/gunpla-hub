import React from "react";
import PostCard from "../universal/PostCard";

export default function UserPosts({ posts }) {
    if (!posts || posts.length === 0)
        return (
            <div className="text-slate-400">This user hasn't posted yet.</div>
        );

    return (
        <div className="space-y-4">
            {posts.map((p) => (
                <PostCard key={p.id} post={p} />
            ))}
        </div>
    );
}
