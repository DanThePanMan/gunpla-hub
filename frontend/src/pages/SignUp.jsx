import { useState } from "react";
import { useContext } from "react";
import JWTContext from "../contexts/jwtContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const { setToken, setUser } = useContext(JWTContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Display name is required";
        } else if (formData.username.trim().length < 2) {
            newErrors.username = "Display name must be at least 2 characters";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/User`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: formData.username,
                            email: formData.email,
                            password: formData.password,
                        }),
                    }
                );
                const data = await response.json();

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        const newErrors = {};
                        errorData.errors.forEach((error) => {
                            newErrors[error.path] = error.msg;
                        });
                        setErrors(newErrors);
                    }
                    return;
                } else {
                    setToken(data.token);
                    setUser(data.user);
                    navigate("/home");
                }
            } catch (error) {
                console.error("Network error:", error);
                setErrors({ general: "Network error. Please try again." });
                return;
            }

            alert("Sign up successful! ");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-2 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-lg">
                {/* Logo and Branding - Compact */}
                <div className="text-center mb-4">
                    <img
                        src="/image.png"
                        alt="Gunpla Hub Logo"
                        className="h-12 w-auto mx-auto mb-2"
                    />
                    <div className="font-extrabold text-3xl text-slate-100">
                        Join Gunpla Hub
                    </div>
                    <p className="text-slate-400 mt-1">
                        Connect with the Gundam building community
                    </p>
                </div>

                {/* Sign Up Form - Compact */}
                <form
                    onSubmit={handleSubmit}
                    className="form-card p-6 rounded-xl shadow-2xl backdrop-blur-sm">
                    {/* Form Fields in Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium mb-1 text-slate-200">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`input-field w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
                                    errors.username ? "border-red-500" : ""
                                }`}
                                placeholder="Display name"
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-medium mb-1 text-slate-200">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
                                    errors.email ? "border-red-500" : ""
                                }`}
                                placeholder="Email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password Fields in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium mb-1 text-slate-200">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input-field w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
                                    errors.password ? "border-red-500" : ""
                                }`}
                                placeholder="Password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-xs font-medium mb-1 text-slate-200">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`input-field w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
                                    errors.confirmPassword
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Confirm password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn-primary w-full py-3 px-4 rounded-lg font-semibold text-white hover:shadow-lg transform hover:scale-[1.02] transition duration-200">
                        Create Account
                    </button>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <span className="text-slate-400 text-sm">
                            Already have an account?{" "}
                        </span>
                        <a
                            href="/Login"
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition duration-200">
                            Sign in
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
