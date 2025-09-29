const Welcome = () => (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
        {/* Main content */}
        <div className="text-center">
            <img
                src="/image.png"
                alt="Gunpla Hub Logo"
                className="logo-large mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold  mb-4">Welcome to Gunpla Hub</h1>
            <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                Sign in/make an account to share your builds! or dont
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                    href="/Login"
                    className="btn btn-neutral px-6 py-2 rounded font-medium">
                    Sign In
                </a>
                <a
                    href="/signup"
                    className="px-6 py-2 border  rounded font-medium ">
                    Join Community
                </a>
                <button
                    onClick={() => {
                        // TODO: Implement guest account functionality
                        alert("Guest account feature coming soon!");
                    }}
                    className="px-6 py-2  rounded font-medium ">
                    Continue as Guest
                </button>
            </div>
        </div>
    </div>
);

export default Welcome;
