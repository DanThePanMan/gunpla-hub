import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JWTContext from "../contexts/jwtContext";
import Gallery from "../components/post/Gallery";
import CommentList from "../components/post/CommentList";
import CommentForm from "../components/post/CommentForm";
import PostSidebar from "../components/post/PostSidebar";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(JWTContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/posts/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted.current) return;
        if (data.success) setPost(data.post);
        else setError(data.message || "Failed to load post");
      })
      .catch((e) => {
        if (!mounted.current) return;
        console.error(e);
        setError("Network error");
      })
      .finally(() => mounted.current && setLoading(false));
  }, [id]);

  const handleCommentPosted = (comment) => {
    setPost((p) => ({ ...p, comments: [comment, ...(p?.comments || [])] }));
  };

  const handlePostUpdated = (updatedPost) => {
    setPost((prev) => ({ ...prev, ...updatedPost }));
  };

  const isAuthor = user && post && user.id === post.authorId;

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      navigate("/Home");
    } catch (err) {
      alert(err.message || "Failed to delete post");
    }
  };

  if (loading) return <div className="p-6">Loading post...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!post) return <div className="p-6">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-start gap-6">
        <div className="w-3/5">
          <Gallery pictures={post.pictures} />
        </div>
        <div className="w-2/5">
          <PostSidebar
            post={post}
            isAuthor={isAuthor}
            onDelete={handleDelete}
            onUpdated={handlePostUpdated}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Comments</h3>
        <CommentForm postId={post.id} onPosted={handleCommentPosted} />
        <div className="mt-4">
          <CommentList comments={post.comments} />
        </div>
      </div>
    </div>
  );
}
