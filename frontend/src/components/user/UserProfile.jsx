import React, { useContext, useState } from "react";
import JWTContext from "../../contexts/jwtContext";
import Avatar from "../universal/Avatar";
import ProfileEditModal from "../universal/ProfileEditModal";

export default function UserProfile({
  user,
  totalPosts,
  isFollowing: initialIsFollowing,
  isOwnProfile,
  followerCount: initialFollowerCount,
  followingCount,
  onFollowChange,
  onProfileUpdated,
}) {
  const { token, user: currentUser } = useContext(JWTContext);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount || 0);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(user);

  if (!user) return null;

  const handleFollowToggle = async () => {
    if (!currentUser || !token) {
      alert("Please log in to follow users");
      return;
    }
    if (loading) return;

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
        if (onFollowChange) onFollowChange(!isFollowing);
      } else {
        alert(data.message || "Failed to update follow status");
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setProfileData((prev) => ({ ...prev, ...updatedUser }));
    if (onProfileUpdated) onProfileUpdated(updatedUser);
  };

  const displayUser = profileData || user;

  return (
    <>
      <div className="bg-slate-800 p-6 rounded border border-slate-700 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={displayUser.profilePicture}
              name={displayUser.displayName}
              size="xl"
            />
            <div>
              <div className="text-slate-100 text-lg font-bold">
                {displayUser.displayName}
              </div>
              <div className="text-slate-400 text-sm">{displayUser.email}</div>
              <div className="flex gap-4 text-slate-400 text-sm mt-2">
                <span>
                  <strong className="text-slate-200">
                    {totalPosts ?? displayUser._count?.posts ?? 0}
                  </strong>{" "}
                  posts
                </span>
                <span>
                  <strong className="text-slate-200">{followerCount}</strong>{" "}
                  followers
                </span>
                <span>
                  <strong className="text-slate-200">
                    {followingCount ?? displayUser._count?.following ?? 0}
                  </strong>{" "}
                  following
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {currentUser && isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn btn-ghost"
              >
                Edit Profile
              </button>
            )}
            {currentUser && !isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                disabled={loading}
                className={`btn ${
                  isFollowing ? "btn-secondary" : "btn-primary"
                }`}
              >
                {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={displayUser}
        onUpdated={handleProfileUpdated}
      />
    </>
  );
}
