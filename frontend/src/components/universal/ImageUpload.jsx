import React, { useState, useRef } from "react";

export default function ImageUpload({ images, onUpload, onRemove, disabled }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    isDragging
                        ? "border-primary bg-primary/10"
                        : "border-slate-600 hover:border-slate-500"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={disabled ? undefined : handleClick}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    id="post-images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={disabled}
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files)}
                />
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <svg
                        className="w-12 h-12 mb-3 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-slate-300">
                        <span className="font-semibold">Click to upload</span> or drag and
                        drop
                    </p>
                    <p className="text-xs text-slate-400">
                        PNG, JPG or GIF (max files: 4)
                    </p>
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className={`grid gap-4 ${
                    images.length === 1 ? 'grid-cols-1' : 
                    images.length === 2 ? 'grid-cols-2' :
                    'grid-cols-2 md:grid-cols-3'
                }`}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-red-500 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(idx);
                                    }}
                                    aria-label="Remove image">
                                    <svg
                                        className="w-5 h-5"
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
