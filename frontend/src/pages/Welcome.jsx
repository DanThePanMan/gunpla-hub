const Welcome = () => (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
        {/* Main content */}
        <div className="text-center">
            <img
                src="/image.png"
                alt="Gunpla Hub Logo"
                className="logo-large mx-auto mb-4"
            />
            <h1 className="text-3xl font-semibold text-slate-100 mb-4">
                Welcome to Gunpla Hub
            </h1>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl">
                The ultimate community for Gundam model enthusiasts. Share your
                builds, connect with fellow builders, and discover amazing
                creations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                    href="/Login"
                    className="btn-primary px-6 py-2 rounded font-medium text-white">
                    Sign In
                </a>
                <a
                    href="/signup"
                    className="px-6 py-2 border border-slate-500 text-slate-300 rounded font-medium hover:bg-slate-700 hover:border-slate-400">
                    Join Community
                </a>
                <button
                    onClick={() => {
                        // TODO: Implement guest account functionality
                        alert("Guest account feature coming soon!");
                    }}
                    className="px-6 py-2 bg-slate-600 text-slate-200 rounded font-medium hover:bg-slate-500 hover:text-white border border-slate-500">
                    Continue as Guest
                </button>
            </div>
        </div>
    </div>
);

export default Welcome;
