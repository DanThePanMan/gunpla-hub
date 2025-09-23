import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likedBy?.length || 0);
    const [carouselIdx, setCarouselIdx] = useState(0);
    const [firstImgHeight, setFirstImgHeight] = useState(null);
    const firstImgRef = useRef(null);

    const handleLike = (e) => {
        e.stopPropagation(); // stop parent click
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Carousel navigation
    const hasPictures =
        Array.isArray(post.pictures) && post.pictures.length > 0;

    const handlePrev = (e) => {
        e.stopPropagation();
        setCarouselIdx((prev) =>
            prev === 0 ? post.pictures.length - 1 : prev - 1
        );
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCarouselIdx((prev) =>
            prev === post.pictures.length - 1 ? 0 : prev + 1
        );
    };

    useEffect(() => {
        if (firstImgRef.current && carouselIdx === 0) {
            setFirstImgHeight(firstImgRef.current.offsetHeight);
        }
    }, [carouselIdx, post.pictures]);

    const nav = useNavigate();
    const postClickHandler = (id) => {
        nav(`/post/${id}`);
    };

    return (
        <div className="form-card rounded border">
            <div
                className=" hover:bg-slate-700 ease-in-out transition-all cursor-pointer p-4 rounded-sm"
                onClick={() => postClickHandler(post.id)}>
                {/* Image Carousel */}
                {hasPictures && (
                    <div
                        className="mb-4 relative flex items-center justify-center"
                        style={
                            firstImgHeight ? { minHeight: firstImgHeight } : {}
                        }>
                        <img
                            ref={carouselIdx === 0 ? firstImgRef : null}
                            src={post.pictures[carouselIdx]}
                            alt={`post-img-${carouselIdx}`}
                            className="max-h-72 w-full object-contain rounded border border-slate-700 bg-slate-900"
                            onLoad={
                                carouselIdx === 0
                                    ? (e) =>
                                          setFirstImgHeight(
                                              e.target.offsetHeight
                                          )
                                    : undefined
                            }
                        />
                        {post.pictures.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 z-10"
                                    aria-label="Previous image">
                                    &#8592;
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 z-10"
                                    aria-label="Next image">
                                    &#8594;
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {post.pictures.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`inline-block w-2 h-2 rounded-full ${
                                                carouselIdx === idx
                                                    ? "bg-white"
                                                    : "bg-slate-500"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Post Header */}
                <div className="flex items-center mb-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ background: "var(--primary)" }}>
                        {post.author.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                        <h3 className="text-slate-200 font-semibold">
                            {post.author.displayName}
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Post Content */}
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-100 mb-2">
                        {post.title}
                    </h2>
                    <p className="text-slate-300">{post.content}</p>
                </div>

                {/* Build Info */}
                {post.build && (
                    <div className="bg-slate-700 rounded p-3 mb-3 border border-slate-600">
                        <div className="flex items-center mb-2">
                            <svg
                                className="w-5 h-5 text-blue-400 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            <span className="text-blue-400 font-medium text-sm">
                                Gunpla Build
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-400">Kit:</span>
                                <span className="text-slate-200 ml-2">
                                    {post.build.kitName}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400">Grade:</span>
                                <span className="text-slate-200 ml-2">
                                    {post.build.grade}
                                </span>
                            </div>
                            {post.build.difficulty && (
                                <div>
                                    <span className="text-slate-400">
                                        Difficulty:
                                    </span>
                                    <span className="text-slate-200 ml-2">
                                        {post.build.difficulty}/10
                                    </span>
                                </div>
                            )}
                        </div>
                        {post.build.customizations && (
                            <div className="mt-2">
                                <span className="text-slate-400 text-sm">
                                    Customizations:
                                </span>
                                <p className="text-slate-300 text-sm mt-1">
                                    {post.build.customizations}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-600 p-4">
                <div className="flex items-center space-x-6">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 ${
                            liked
                                ? "text-red-400"
                                : "text-slate-400 hover:text-red-400"
                        }`}>
                        <svg
                            className="w-5 h-5"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span className="text-sm">{likeCount}</span>
                    </button>

                    {/* Comments */}
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition duration-200">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="text-sm">
                            {post.comments?.length || 0}
                        </span>
                    </button>

                    {/* Share */}
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-2 text-slate-400 hover:text-green-400 transition duration-200">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                        </svg>
                        <span className="text-sm">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
