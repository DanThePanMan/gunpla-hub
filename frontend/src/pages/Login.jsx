import { useState } from "react";
import LoginSection from "../components/Login/LoginSection";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function submitLogin() {
        try {
            fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Main content */}
            <div className="relative z-10">
                <LoginSection
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    submitLogin={submitLogin}
                />
            </div>
        </div>
    );
};

export default Login;
