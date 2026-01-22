import React, { useState, useContext, useEffect } from "react";
import JWTContext from "../../contexts/jwtContext";
import ImageUpload from "./ImageUpload";
import uploadFile from "../../utils/supabaseUtils";

const gradeOptions = [
  "High Grade",
  "Real Grade",
  "Master Grade",
  "Perfect Grade",
  "Mega Size",
];

export default function EditPostModal({ isOpen, onClose, post, onUpdated }) {
  const { token } = useContext(JWTContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingPictures, setExistingPictures] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [includeBuild, setIncludeBuild] = useState(false);
  const [build, setBuild] = useState({
    kitName: "",
    grade: "",
    difficulty: "",
    customizations: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setExistingPictures(post.pictures || []);
      setNewImages([]);
      if (post.build) {
        setIncludeBuild(true);
        setBuild({
          kitName: post.build.kitName || "",
          grade: post.build.grade || "",
          difficulty: post.build.difficulty || "",
          customizations: post.build.customizations || "",
        });
      } else {
        setIncludeBuild(false);
        setBuild({
          kitName: "",
          grade: "",
          difficulty: "",
          customizations: "",
        });
      }
    }
  }, [post]);

  const handleImageUpload = (files) => {
    setNewImages((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingPictures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBuildChange = (field, value) => {
    setBuild((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload new images
      const newUrls = [];
      for (const image of newImages) {
        const ext = image.name.includes(".")
          ? image.name.substring(image.name.lastIndexOf("."))
          : "";
        const uniqueName = `post_images/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}${ext}`;
        const data = await uploadFile(image, uniqueName);
        if (data && data.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }

      const allPictures = [...existingPictures, ...newUrls];

      const payload = {
        title: title.trim(),
        content: content.trim(),
        pictures: allPictures,
      };

      if (includeBuild && build.kitName.trim()) {
        payload.build = {
          kitName: build.kitName.trim(),
          grade: build.grade,
          difficulty: build.difficulty ? parseInt(build.difficulty, 10) : null,
          customizations: build.customizations.trim() || null,
        };
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      if (onUpdated) onUpdated(data.post);
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
      <div className="bg-base-200 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-100">Edit Post</h2>
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
          <div>
            <label className="block text-sm text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea w-full resize-none"
              rows={4}
              placeholder="Write your post..."
            />
          </div>

          {/* Existing Images */}
          {existingPictures.length > 0 && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-3 gap-2">
                {existingPictures.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`existing-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Add New Images
            </label>
            <ImageUpload
              images={newImages}
              onUpload={handleImageUpload}
              onRemove={handleRemoveNewImage}
            />
          </div>

          <div className="border-t border-slate-600 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBuild}
                onChange={(e) => setIncludeBuild(e.target.checked)}
                className="checkbox"
              />
              <span className="text-slate-300">
                Include Gunpla Build Details
              </span>
            </label>
          </div>

          {includeBuild && (
            <div className="bg-slate-700 p-4 rounded border border-slate-600 space-y-3">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">
                Build Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Kit Name *
                </label>
                <input
                  type="text"
                  value={build.kitName}
                  onChange={(e) => handleBuildChange("kitName", e.target.value)}
                  className="input w-full"
                  placeholder="e.g., RX-78-2 Gundam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Grade *
                </label>
                <select
                  value={build.grade}
                  onChange={(e) => handleBuildChange("grade", e.target.value)}
                  className="select w-full"
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Difficulty (1-10)
                </label>
                <input
                  type="number"
                  value={build.difficulty}
                  onChange={(e) =>
                    handleBuildChange("difficulty", e.target.value)
                  }
                  min="1"
                  max="10"
                  className="input w-full"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Customizations & Techniques
                </label>
                <textarea
                  value={build.customizations}
                  onChange={(e) =>
                    handleBuildChange("customizations", e.target.value)
                  }
                  className="textarea w-full resize-none"
                  rows={3}
                  placeholder="Describe any modifications..."
                />
              </div>
            </div>
          )}

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
