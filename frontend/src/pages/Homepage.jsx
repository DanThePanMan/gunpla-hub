const Homepage = () => (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Main content */}
        <div className="relative z-10 text-center">
            <img
                src="/image.png"
                alt="Gunpla Hub Logo"
                className="logo-large mx-auto mb-6"
            />
            <h1 className="text-5xl font-bold text-slate-100 mb-4">
                Welcome to Gunpla Hub
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                The ultimate community for Gundam model enthusiasts. Share your
                builds, connect with fellow builders, and discover amazing
                creations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                    href="/Login"
                    className="btn-primary px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg transform hover:scale-[1.02] transition duration-200">
                    Sign In
                </a>
                <a
                    href="/signup"
                    className="px-8 py-3 border border-slate-500 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-400 transition duration-200">
                    Join Community
                </a>
                <button
                    onClick={() => {
                        // TODO: Implement guest account functionality
                        alert("Guest account feature coming soon!");
                    }}
                    className="px-8 py-3 bg-slate-600 text-slate-200 rounded-lg font-semibold hover:bg-slate-500 hover:text-white transition duration-200 border border-slate-500">
                    Continue as Guest
                </button>
            </div>
        </div>
    </div>
);

export default Homepage;
