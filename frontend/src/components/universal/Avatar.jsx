import React from "react";

export default function Avatar({ src, name, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const initial = name?.charAt(0)?.toUpperCase() || "U";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
      style={{ background: "var(--primary)" }}
    >
      {initial}
    </div>
  );
}
