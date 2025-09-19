import React, { useState, useContext } from "react";
import JWTContext from "../../contexts/jwtContext";

const NewPostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { user, token } = useContext(JWTContext);
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

        try {
            const postData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
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
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="form-card p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-100">
                            Create New Post
                        </h2>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-slate-400 hover:text-slate-200 transition duration-200 disabled:opacity-50">
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
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
                                className={`input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50 ${
                                    errors.title
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : ""
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
                                className={`input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50 resize-none ${
                                    errors.content
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : ""
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
                            <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600 space-y-4">
                                <h3 className="text-lg font-semibold text-slate-200 mb-4">
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
                        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-600">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-6 py-3 text-slate-300 hover:text-slate-100 transition duration-200 disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !user}
                                className="btn-primary px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
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
