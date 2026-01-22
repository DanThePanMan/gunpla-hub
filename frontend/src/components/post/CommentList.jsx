import React from "react";

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0)
    return <p className="text-slate-400">No comments yet.</p>;

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className="bg-slate-800 p-3 rounded border border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="text-slate-200 font-medium">
              {c.commenterUser?.displayName || "User"}
            </div>
            <div className="text-slate-400 text-xs">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-slate-400 text-sm mt-1">{c.content}</div>
        </div>
      ))}
    </div>
  );
}
