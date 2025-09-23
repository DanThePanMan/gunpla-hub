import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import UserPosts from "../components/user/UserPosts";

export default function UserPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(
            `${import.meta.env.VITE_API_URL}/posts/user/${encodeURIComponent(
                id
            )}`
        )
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    setUser(data.user);
                    setPosts(data.posts || []);
                } else {
                    setError(data.message || "Failed to load user posts");
                }
            })
            .catch((e) => {
                console.error(e);
                setError("Network error");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-6">Loading user...</div>;
    if (error) return <div className="p-6 text-red-400">{error}</div>;
    if (!user) return <div className="p-6">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <UserProfile user={user} totalPosts={posts.length} />
            <UserPosts posts={posts} />
        </div>
    );
}
