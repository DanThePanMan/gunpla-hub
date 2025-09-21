import React, { useState, useContext } from "react";
import JWTContext from "../../contexts/jwtContext";
import PostsContext from "../../contexts/postsContext";
import uploadFile from "../../utils/supabaseUtils";

const NewPostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { user, token } = useContext(JWTContext);
    const { setPosts } = useContext(PostsContext);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        includeBuild: false,
        build: {
            kitName: "",
            grade: "",
            difficulty: "",
            customizations: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [images, setImages] = useState([]);

    const handleImageUpload = (files) => {
        setImages(Array.from(files));
    };

    const handleRemoveImage = (idxToRemove) => {
        setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
    };

    const gradeOptions = [
        "High Grade",
        "Real Grade",
        "Master Grade",
        "Perfect Grade",
        "Mega Size",
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("build.")) {
            const buildField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                build: {
                    ...prev.build,
                    [buildField]: value,
                },
            }));
        } else if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 3) {
            newErrors.title = "Title must be at least 3 characters";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        } else if (formData.content.length < 10) {
            newErrors.content = "Content must be at least 10 characters";
        }

        if (formData.includeBuild) {
            if (!formData.build.kitName.trim()) {
                newErrors["build.kitName"] = "Kit name is required";
            }
            if (!formData.build.grade) {
                newErrors["build.grade"] = "Grade is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // now do the prisma thing to form links, that can be stored
        const urls = [];

        for (const image of images) {
            // Extract extension safely
            const ext = image.name.includes(".")
                ? image.name.substring(image.name.lastIndexOf("."))
                : "";
            const uniqueName = `post_images/${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}${ext}`;
            const data = await uploadFile(image, uniqueName);
            if (data && data.publicUrl) {
                urls.push(data.publicUrl);
            }
        }

        try {
            const postData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                pictures: urls,
            };

            if (formData.includeBuild) {
                postData.build = {
                    kitName: formData.build.kitName.trim(),
                    grade: formData.build.grade,
                    difficulty: formData.build.difficulty
                        ? parseInt(formData.build.difficulty)
                        : null,
                    customizations:
                        formData.build.customizations.trim() || null,
                };
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/posts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                // Reset form
                setFormData({
                    title: "",
                    content: "",
                    includeBuild: false,
                    build: {
                        kitName: "",
                        grade: "",
                        difficulty: "",
                        customizations: "",
                    },
                });
                setErrors({});

                // Call success callback
                if (onPostCreated) {
                    onPostCreated(data.post);
                }
                setImages([]);
                setPosts((prev) => [data.post, ...prev]);

                onClose();
            } else {
                if (data.errors) {
                    const validationErrors = {};
                    data.errors.forEach((error) => {
                        validationErrors[error.path] = error.msg;
                    });
                    setErrors(validationErrors);
                } else {
                    setErrors({
                        general: data.message || "Failed to create post",
                    });
                }
            }
        } catch (error) {
            console.error("Error creating post:", error);
            setErrors({ general: "Network error. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                title: "",
                content: "",
                includeBuild: false,
                build: {
                    kitName: "",
                    grade: "",
                    difficulty: "",
                    customizations: "",
                },
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={handleClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="form-card p-6 rounded border">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-100">
                            Create New Post
                        </h2>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-slate-400 hover:text-slate-200 disabled:opacity-50">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label
                                className="block text-sm font-medium text-slate-200 mb-2"
                                htmlFor="post-images">
                                Images
                            </label>
                            <input
                                id="post-images"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={isSubmitting}
                                className="input-field w-full px-3 py-2 rounded disabled:opacity-50"
                                onChange={(e) =>
                                    handleImageUpload(e.target.files)
                                }
                            />
                            {/* Preview selected images */}
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative w-16 h-16 bg-slate-800 border border-slate-700 rounded overflow-hidden flex items-center justify-center">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`preview-${idx}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-white/90 text-slate-700 border border-slate-300 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition"
                                                style={{ padding: 0 }}
                                                onClick={() =>
                                                    handleRemoveImage(idx)
                                                }
                                                aria-label="Remove image">
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M3 3L9 9M9 3L3 9"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded">
                                {errors.general}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-slate-200 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className={`input-field w-full px-3 py-2 rounded disabled:opacity-50 ${
                                    errors.title ? "border-red-500" : ""
                                }`}
                                placeholder="What's your build about?"
                                maxLength={200}
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-slate-200 mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                rows={4}
                                className={`input-field w-full px-3 py-2 rounded disabled:opacity-50 resize-none ${
                                    errors.content ? "border-red-500" : ""
                                }`}
                                placeholder="Share details about your build, techniques used, or your experience..."
                                maxLength={5000}
                            />
                            {errors.content && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.content}
                                </p>
                            )}
                            <p className="text-slate-400 text-sm mt-1">
                                {formData.content.length}/5000 characters
                            </p>
                        </div>

                        {/* Include Build Toggle */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="includeBuild"
                                name="includeBuild"
                                checked={formData.includeBuild}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                                htmlFor="includeBuild"
                                className="text-slate-200 font-medium">
                                Include Gunpla Build Details
                            </label>
                        </div>

                        {/* Build Details */}
                        {formData.includeBuild && (
                            <div className="bg-slate-700 p-4 rounded border border-slate-600 space-y-3">
                                <h3 className="text-lg font-semibold text-slate-200 mb-3">
                                    Build Details
                                </h3>

                                {/* Kit Name */}
                                <div>
                                    <label
                                        htmlFor="build.kitName"
                                        className="block text-sm font-medium text-slate-200 mb-2">
                                        Kit Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="build.kitName"
                                        name="build.kitName"
                                        value={formData.build.kitName}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className={`input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50 ${
                                            errors["build.kitName"]
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                : ""
                                        }`}
                                        placeholder="e.g., RX-78-2 Gundam"
                                        maxLength={200}
                                    />
                                    {errors["build.kitName"] && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors["build.kitName"]}
                                        </p>
                                    )}
                                </div>

                                {/* Grade */}
                                <div>
                                    <label
                                        htmlFor="build.grade"
                                        className="block text-sm font-medium text-slate-200 mb-2">
                                        Grade *
                                    </label>
                                    <select
                                        id="build.grade"
                                        name="build.grade"
                                        value={formData.build.grade}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className={`input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50 ${
                                            errors["build.grade"]
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                : ""
                                        }`}>
                                        <option value="">Select Grade</option>
                                        {gradeOptions.map((grade) => (
                                            <option key={grade} value={grade}>
                                                {grade}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["build.grade"] && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors["build.grade"]}
                                        </p>
                                    )}
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label
                                        htmlFor="build.difficulty"
                                        className="block text-sm font-medium text-slate-200 mb-2">
                                        Difficulty (1-10)
                                    </label>
                                    <input
                                        type="number"
                                        id="build.difficulty"
                                        name="build.difficulty"
                                        value={formData.build.difficulty}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        min="1"
                                        max="10"
                                        className="input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50"
                                        placeholder="Optional"
                                    />
                                </div>

                                {/* Customizations */}
                                <div>
                                    <label
                                        htmlFor="build.customizations"
                                        className="block text-sm font-medium text-slate-200 mb-2">
                                        Customizations & Techniques
                                    </label>
                                    <textarea
                                        id="build.customizations"
                                        name="build.customizations"
                                        value={formData.build.customizations}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        rows={3}
                                        className="input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50 resize-none"
                                        placeholder="e.g., Panel lining, custom paint scheme, weathering effects..."
                                        maxLength={1000}
                                    />
                                    <p className="text-slate-400 text-sm mt-1">
                                        {formData.build.customizations.length}
                                        /1000 characters
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-600">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-slate-300 hover:text-slate-100 disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !user}
                                className="btn-primary px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </div>
                                ) : (
                                    "Create Post"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPostModal;
