import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import JWTContext from "../contexts/jwtContext";
import UserProfile from "../components/user/UserProfile";
import UserPosts from "../components/user/UserPosts";

export default function UserPage() {
  const { id } = useParams();
  const { token, user: currentUser } = useContext(JWTContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch user profile with follow info
    const fetchUserProfile = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const profileRes = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(id)}`,
          { headers },
        );
        const profileData = await profileRes.json();

        // Fetch user posts
        const postsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/user/${encodeURIComponent(
            id,
          )}`,
        );
        const postsData = await postsRes.json();

        if (profileData.success) {
          setUser(profileData.user);
        } else if (postsData.success) {
          // Fallback to posts endpoint user data
          setUser(postsData.user);
        } else {
          setError(profileData.message || "Failed to load user");
          return;
        }

        if (postsData.success) {
          setPosts(postsData.posts || []);
        }
      } catch (e) {
        console.error(e);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, token]);

  if (loading) return <div className="p-6">Loading user...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <UserProfile
        user={user}
        totalPosts={posts.length}
        isFollowing={user.isFollowing}
        isOwnProfile={
          user.isOwnProfile || (currentUser && currentUser.id === user.userId)
        }
        followerCount={user._count?.followers || 0}
        followingCount={user._count?.following || 0}
      />
      <UserPosts posts={posts} />
    </div>
  );
}
