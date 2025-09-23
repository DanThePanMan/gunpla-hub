import React, { useContext, useState } from "react";
import JWTContext from "../../contexts/jwtContext";

export default function CommentForm({ postId, onPosted }) {
    const { token, user } = useContext(JWTContext);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: content.trim() }),
                }
            );
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to post comment");
            setContent("");
            if (onPosted) onPosted(data.comment);
        } catch (err) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p className="text-slate-400">Log in to comment.</p>;

    return (
        <form onSubmit={submit} className="space-y-2">
            {error && <div className="text-red-400">{error}</div>}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700"
                rows={3}
                placeholder="Write a comment..."
            />
            <div className="flex justify-between items-center">
                <div className="text-sm text-slate-400">
                    Posting as{" "}
                    <span className="text-slate-200">{user.displayName}</span>
                </div>
                <button
                    className="btn-primary px-4 py-2 rounded"
                    disabled={loading}>
                    {loading ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </form>
    );
}
