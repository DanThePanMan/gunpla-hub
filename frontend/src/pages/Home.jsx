import { useState, useEffect, useContext } from "react";
import Feed from "../components/home/Feed";
import { samplePosts, getRandomPosts } from "../data/samplePosts";
import JWTContext from "../contexts/jwtContext";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setToken, user, setUser } = useContext(JWTContext);

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setPosts(samplePosts);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const refreshFeed = () => {
        setIsLoading(true);
        // Simulate refresh with random order
        setTimeout(() => {
            setPosts(getRandomPosts());
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background with glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-purple-900/20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 pt-6">
                <div className="max-w-7xl mx-auto flex gap-6 px-4">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:w-64 xl:w-80 flex-shrink-0">
                        <div className="sticky top-6 space-y-6 h-fit">
                            {/* Logo & User Profile */}
                            <div className="form-card p-6 rounded-xl shadow-lg backdrop-blur-sm">
                                <div className="flex items-center space-x-3 mb-6">
                                    <img
                                        src="/image.png"
                                        alt="Gunpla Hub Logo"
                                        className="h-8 w-auto"
                                    />
                                    <h1 className="text-xl font-bold text-slate-100">
                                        Gunpla Hub
                                    </h1>
                                </div>

                                {/* User Info */}
                                {user ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {user.displayName
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    user.email
                                                        ?.charAt(0)
                                                        .toUpperCase() ||
                                                    "U"}
                                            </div>
                                            <div>
                                                <div className="text-slate-200 font-semibold text-sm">
                                                    {user.displayName ||
                                                        user.email?.split(
                                                            "@"
                                                        )[0] ||
                                                        "User"}
                                                </div>
                                                <div className="text-slate-400 text-xs">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-slate-400 hover:text-red-400 transition duration-200 text-xs">
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="text-slate-400 text-sm mb-3">
                                            Please log in to continue
                                        </div>
                                        <a
                                            href="/login"
                                            className="btn-primary px-4 py-2 rounded-lg text-sm">
                                            Login
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Menu */}
                            <div className="form-card p-6 rounded-xl shadow-lg backdrop-blur-sm">
                                <h2 className="text-slate-200 font-bold text-lg mb-4">
                                    Navigation
                                </h2>
                                {/* New Post Button */}
                                <button className="btn-primary w-full mb-4 py-3 rounded-lg font-medium text-sm">
                                    New Post
                                </button>

                                <nav className="space-y-3">
                                    <a
                                        href="#"
                                        className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        <span>Home</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <span>Explore</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span>Profile</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center space-x-3 text-slate-300 hover:text-white transition duration-200 p-2 rounded-lg hover:bg-slate-700/30">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                            />
                                        </svg>
                                        <span>Settings</span>
                                    </a>
                                </nav>
                            </div>

                            {/* Quick Stats */}
                            <div className="form-card p-6 rounded-xl shadow-lg backdrop-blur-sm">
                                <h3 className="text-slate-200 font-semibold mb-4">
                                    Community Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Builds
                                        </span>
                                        <span className="text-blue-400 font-semibold">
                                            {samplePosts.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Likes
                                        </span>
                                        <span className="text-green-400 font-semibold">
                                            {samplePosts.reduce(
                                                (total, post) =>
                                                    total + post.likedBy.length,
                                                0
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Comments
                                        </span>
                                        <span className="text-purple-400 font-semibold">
                                            {samplePosts.reduce(
                                                (total, post) =>
                                                    total +
                                                    post.comments.length,
                                                0
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
                        {/* Create Post */}

                        {/* Feed */}
                        <Feed posts={posts} loading={isLoading} />
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block xl:w-80 flex-shrink-0">
                        <div className="sticky top-20 space-y-6 h-fit">
                            {/* Trending */}
                            <div className="form-card p-6 rounded-xl shadow-lg backdrop-blur-sm">
                                <h3 className="text-slate-200 font-bold text-lg mb-4">
                                    What's Popular
                                </h3>
                                <div className="space-y-2">
                                    <div className="hover:bg-slate-700/30 p-3 rounded-lg transition duration-200 cursor-pointer">
                                        <div className="text-slate-400 text-xs">
                                            Trending in Gunpla
                                        </div>
                                        <div className="text-slate-200 font-semibold">
                                            #PerfectGrade
                                        </div>
                                        <div className="text-slate-400 text-xs">
                                            1,234 posts
                                        </div>
                                    </div>
                                    <div className="hover:bg-slate-700/30 p-3 rounded-lg transition duration-200 cursor-pointer">
                                        <div className="text-slate-400 text-xs">
                                            Trending in Gunpla
                                        </div>
                                        <div className="text-slate-200 font-semibold">
                                            #CustomPaint
                                        </div>
                                        <div className="text-slate-400 text-xs">
                                            892 posts
                                        </div>
                                    </div>
                                    <div className="hover:bg-slate-700/30 p-3 rounded-lg transition duration-200 cursor-pointer">
                                        <div className="text-slate-400 text-xs">
                                            Trending in Gunpla
                                        </div>
                                        <div className="text-slate-200 font-semibold">
                                            #Weathering
                                        </div>
                                        <div className="text-slate-400 text-xs">
                                            567 posts
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Suggested Builders */}
                            <div className="form-card p-6 rounded-xl shadow-lg backdrop-blur-sm">
                                <h3 className="text-slate-200 font-bold text-lg mb-4">
                                    Who to Follow
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                M
                                            </div>
                                            <div>
                                                <div className="text-slate-200 font-semibold text-sm">
                                                    MasterBuilder
                                                </div>
                                                <div className="text-slate-400 text-xs">
                                                    @masterbuilder
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition duration-200">
                                            Follow
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                K
                                            </div>
                                            <div>
                                                <div className="text-slate-200 font-semibold text-sm">
                                                    KitbashKing
                                                </div>
                                                <div className="text-slate-400 text-xs">
                                                    @kitbashking
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition duration-200">
                                            Follow
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
