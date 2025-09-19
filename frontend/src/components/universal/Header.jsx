import React, { useContext } from "react";
import JWTContext from "../../contexts/jwtContext";

const Header = () => {
    const { token, setToken, user, setUser } = useContext(JWTContext);

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <header
            className="sticky top-0 z-50 bg-slate-900/95 border-b"
            style={{ borderColor: "var(--border)" }}>
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="/image.png"
                            alt="Gunpla Hub Logo"
                            className="h-8 w-auto"
                        />
                        <h1 className="text-xl font-bold text-slate-100">
                            Gunpla Hub
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a
                            href="#"
                            className="text-slate-300 hover:text-white transition duration-200">
                            Feed
                        </a>
                        <a
                            href="#"
                            className="text-slate-300 hover:text-white transition duration-200">
                            Discover
                        </a>
                        <a
                            href="#"
                            className="text-slate-300 hover:text-white transition duration-200">
                            My Builds
                        </a>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {token ? (
                            <>
                                <button className="btn-primary px-4 py-2 rounded font-medium text-sm">
                                    New Post
                                </button>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user?.displayName
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-slate-400 hover:text-red-400 transition duration-200 text-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <a
                                    href="/Login"
                                    className="text-slate-300 hover:text-white transition duration-200 text-sm">
                                    Sign In
                                </a>
                                <a
                                    href="/signup"
                                    className="btn-primary px-4 py-2 rounded font-medium text-sm">
                                    Join
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
