import { useState } from "react";
import LoginSection from "../components/Login/LoginSection";
import { useContext } from "react";
import JWTContext from "../contexts/jwtContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { setToken, setUser } = useContext(JWTContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

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
                navigate("/home");
            } else {
                setMessage("Login failed, please verify your credentials");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
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
