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
        <form
            onSubmit={submit}
            className="card bg-base-200 border border-base-300 p-6 ">
            {error && <div className="text-red-400">{error}</div>}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea w-full resize-none"
                rows={3}
                placeholder="Write a comment..."
            />
            <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-slate-400">
                    Posting as{" "}
                    <span className="text-slate-200">{user.displayName}</span>
                </div>
                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </form>
    );
}
