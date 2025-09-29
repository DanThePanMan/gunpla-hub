import React from "react";

const LoginSection = (props) => {
    const { message, email, setEmail, password, setPassword, submitLogin } =
        props;

    return (
        <>
            <div className="text-center mb-8">
                <img
                    src="/image.png"
                    alt="Gunpla Hub Logo"
                    className="logo-large mx-auto mb-4"
                />
                <div className="font-semibold text-2xl text-slate-100">
                    Log in to Gunpla Hub
                </div>
                <p className="text-slate-400 mt-2">
                    Welcome back to the community
                </p>
            </div>

            <form className="card bg-base-200 border border-base-300 p-6  w-96">
                <p className="text-warning font-semibold">{message}</p>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2 text-slate-200">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input w-full"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2 text-slate-200">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input w-full"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        submitLogin();
                    }}
                    type="submit"
                    className="btn btn-primary w-full py-2 px-4  font-medium ">
                    Log in
                </button>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <a
                        href="#"
                        className="text-slate-400 hover:text-slate-300 text-sm transition duration-200">
                        Forgot your password?
                    </a>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-slate-400 text-sm">
                        Don't have an account?{" "}
                    </span>
                    <a
                        href="/signup"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition duration-200">
                        Sign up
                    </a>
                </div>
            </form>
        </>
    );
};

export default LoginSection;
