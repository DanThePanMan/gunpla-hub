import React from "react";

const LoginSection = (props) => {
    const { email, setEmail, password, setPassword, submitLogin } = props;

    return (
        <>
            <div className="font-extrabold text-3xl mb-8">
                Log in to Gunplahub
            </div>
            <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96">
                <div className="mb-6">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        submitLogin();
                    }}
                    type="submit"
                    className="w-full bg-slate-900 border border-gray-300 py-2 px-4 rounded-md hover:bg-slate-800 transition duration-200">
                    Log in
                </button>
            </form>
        </>
    );
};

export default LoginSection;
