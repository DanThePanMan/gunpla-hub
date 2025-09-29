import React from "react";

export default function BuildDetailsForm({
    formData,
    errors,
    onChange,
    disabled,
    gradeOptions,
}) {
    return (
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
                    onChange={onChange}
                    disabled={disabled}
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
                    onChange={onChange}
                    disabled={disabled}
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
                    onChange={onChange}
                    disabled={disabled}
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
                    onChange={onChange}
                    disabled={disabled}
                    rows={3}
                    className="input-field w-full px-4 py-3 rounded-lg transition duration-200 disabled:opacity-50 resize-none"
                    placeholder="e.g., Panel lining, custom paint scheme, weathering effects..."
                    maxLength={1000}
                />
                <p className="text-slate-400 text-sm mt-1">
                    {formData.build.customizations.length}/1000 characters
                </p>
            </div>
        </div>
    );
}
