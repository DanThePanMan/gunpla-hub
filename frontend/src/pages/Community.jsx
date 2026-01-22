import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import JWTContext from "../contexts/jwtContext";

export default function Community() {
  const { token, user: currentUser } = useContext(JWTContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers,
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || "Failed to load users");
        }
      } catch (e) {
        console.error(e);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <div className="p-6">Loading community...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Community</h1>
      <p className="text-slate-400 mb-6">
        Discover and connect with other Gunpla enthusiasts!
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <UserCard
            key={user.userId}
            user={user}
            token={token}
            isCurrentUser={currentUser && currentUser.id === user.userId}
          />
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-slate-400 text-center py-8">
          No users found yet. Be the first to sign up!
        </p>
      )}
    </div>
  );
}

function UserCard({ user, token, isCurrentUser }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(
    user._count?.followers || 0,
  );
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!token) {
      alert("Please log in to follow users");
      return;
    }
    if (loading || isCurrentUser) return;

    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.userId}/follow`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      } else {
        alert(data.message || "Failed to update follow status");
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded border border-slate-700 flex items-center justify-between">
      <Link
        to={`/user/${user.userId}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ background: "var(--primary)" }}
        >
          {user.displayName?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div className="text-slate-100 font-semibold hover:text-primary transition-colors">
            {user.displayName}
          </div>
          <div className="text-slate-400 text-sm">
            {user._count?.posts || 0} posts • {followerCount} followers
          </div>
        </div>
      </Link>

      {!isCurrentUser && token && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`btn btn-sm ${
            isFollowing ? "btn-secondary" : "btn-primary"
          }`}
        >
          {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {isCurrentUser && <span className="text-slate-500 text-sm">You</span>}
    </div>
  );
}
