import { useState } from "react";
import LoginSection from "../components/Login/LoginSection";
import { useContext } from "react";
import JWTContext from "../contexts/jwtContext";

const Login = () => {
    const { setToken, setUser } = useContext(JWTContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function submitLogin() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
            } else {
                setMessage("Login failed, please verify your credentials");
            }
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
                    message={message}
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
