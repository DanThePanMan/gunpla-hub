import React, { useState, useContext, useEffect } from "react";
import JWTContext from "../../contexts/jwtContext";
import ImageUpload from "./ImageUpload";
import uploadFile from "../../utils/supabaseUtils";

export default function ProfileEditModal({ isOpen, onClose, user, onUpdated }) {
  const { token, setUser } = useContext(JWTContext);
  const [displayName, setDisplayName] = useState("");
  const [existingPicture, setExistingPicture] = useState(null);
  const [newImage, setNewImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setExistingPicture(user.profilePicture || null);
      setNewImage([]);
    }
  }, [user]);

  const handleImageUpload = (files) => {
    setNewImage(Array.from(files).slice(0, 1));
    setExistingPicture(null); // Remove existing when new is selected
  };

  const handleRemoveNewImage = () => {
    setNewImage([]);
  };

  const handleRemoveExistingPicture = () => {
    setExistingPicture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let profilePictureUrl = existingPicture;

      // Upload new image if selected
      if (newImage.length > 0) {
        const image = newImage[0];
        const ext = image.name.includes(".")
          ? image.name.substring(image.name.lastIndexOf("."))
          : "";
        const uniqueName = `profile_pictures/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}${ext}`;
        const data = await uploadFile(image, uniqueName);
        if (data && data.publicUrl) {
          profilePictureUrl = data.publicUrl;
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          profilePicture: profilePictureUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update the user in context
      setUser((prev) => ({
        ...prev,
        displayName: data.user.displayName,
        profilePicture: data.user.profilePicture,
      }));

      if (onUpdated) onUpdated(data.user);
      onClose();
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-100">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Profile Picture */}
          {existingPicture && newImage.length === 0 && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Current Profile Picture
              </label>
              <div className="relative group w-24 h-24 mx-auto">
                <img
                  src={existingPicture}
                  alt="Current profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveExistingPicture}
                  className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* New Image Upload */}
          {!existingPicture && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Profile Picture
              </label>
              <ImageUpload
                images={newImage}
                onUpload={handleImageUpload}
                onRemove={handleRemoveNewImage}
              />
            </div>
          )}

          {existingPicture && (
            <p className="text-sm text-slate-400 text-center">
              Remove current picture to upload a new one
            </p>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input w-full"
              placeholder="Your display name"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
