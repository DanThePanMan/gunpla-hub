import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import JWTContext from "../../contexts/jwtContext";
import NewPostModal from "./newPost";
import PostsContext from "../../contexts/postsContext";

const NavBar = () => {
    const { user, setToken, setUser } = useContext(JWTContext);
    const { posts, setPosts } = useContext(PostsContext);
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target)
            ) {
                setUserMenuOpen(false);
            }
        }

        function handleKey(e) {
            if (e.key === "Escape") setUserMenuOpen(false);
        }

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <header className="w-screen bg-base-100">
            <div className="w-screen mx-auto px-4 ">
                <div className="flex justify-between h-16 items-center pt-6">
                    {/* Left: Logo / Title */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/image.png"
                                alt="logo"
                                className="h-8 w-auto"
                            />
                            <span className="ml-2 font-bold text-lg text-slate-100">
                                Gunpla Hub
                            </span>
                        </Link>
                    </div>

                    <nav className=" flex flex-row gap-2 py-2 px-2">
                        <Link
                            to="/Home"
                            className="btn bg-base-100 border-base-100 hover:bg-base-200 flex items-center gap-2"
                            aria-label="Home"
                            title="Home"
                            data-tooltip-content="Home"
                            data-tooltip-id="nav-tooltip">
                            {/* Home icon */}
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                aria-hidden>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
                                />
                            </svg>
                            <span className="sr-only">Home</span>
                        </Link>
                        <a
                            href="#"
                            className="btn bg-base-100 border-base-100 hover:bg-base-200 flex items-center gap-2"
                            aria-label="Explore"
                            title="Explore"
                            data-tooltip-content="Explore"
                            data-tooltip-id="nav-tooltip">
                            {/* Search/Explore icon */}
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                aria-hidden>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                                />
                            </svg>
                            <span className="sr-only">Explore</span>
                        </a>
                        <a
                            href="#"
                            className="btn bg-base-100 border-base-100 hover:bg-base-200 flex items-center gap-2"
                            aria-label="Community"
                            title="Community"
                            data-tooltip-content="Community"
                            data-tooltip-id="nav-tooltip">
                            {/* Community icon */}
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                aria-hidden>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 11-8 0 4 4 0 018 0zm8 0a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                            <span className="sr-only">Community</span>
                        </a>

                        {user ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsNewPostModalOpen(true)}
                                    className="btn bg-base-100 border-base-100 hover:bg-base-200 flex items-center gap-2"
                                    aria-label="New Post"
                                    title="New Post"
                                    data-tooltip-content="New Post"
                                    data-tooltip-id="nav-tooltip">
                                    {/* Plus icon */}
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        aria-hidden>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <span className="sr-only">New Post</span>
                                </button>

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUserMenuOpen((s) => !s)
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={userMenuOpen}
                                        title={user.displayName || user.email}
                                        className="flex items-center gap-3 bg-base-200/50 hover:bg-base-200 px-2 py-2 rounded-full border border-base-300">
                                        <div className="rounded-full bg-red-400 h-8 w-8 text-white font-bold flex items-center justify-center text-sm">
                                            {user.displayName
                                                ?.charAt(0)
                                                .toUpperCase() ||
                                                user.email
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                "U"}
                                        </div>
                                        <span className="text-sm text-slate-100 truncate">
                                            {user.displayName ||
                                                user.email?.split("@")[0]}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
                                                userMenuOpen ? "rotate-180" : ""
                                            }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden>
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-44 bg-base-200 rounded-lg shadow-lg z-50">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                title="Log out"
                                                className="w-full text-left px-4 py-2 text-sm text-slate-100 hover:bg-base-300 rounded-md transition-all ease-in-out">
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/Login"
                                    className="btn btn-primary flex items-center gap-2"
                                    aria-label="Login"
                                    title="Login"
                                    data-tooltip-id="nav-tooltip"
                                    data-tooltip-content="Login">
                                    {/* Login icon */}
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        aria-hidden>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 17l5-5-5-5"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12H3"
                                        />
                                    </svg>
                                    <span className="sr-only">Login</span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>

            {/* Tooltip (follow cursor) */}
            <Tooltip
                className="mt-4 rounded-md"
                id="nav-tooltip"
                place="bottom"
                delayShow={100}
                float
            />

            {/* New Post Modal */}
            <NewPostModal
                isOpen={isNewPostModalOpen}
                onClose={() => setIsNewPostModalOpen(false)}
                posts={posts}
                setPosts={setPosts}
            />
        </header>
    );
};

export default NavBar;
