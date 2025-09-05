import { useState } from "react";
import LoginSection from "../components/Login/LoginSection";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function submitLogin() {
        try {
            fetch("http://localhost:3000/auth/login", {
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
        <div className="bg-slate-900 w-[100%] flex flex-col justify-center items-center h-screen">
            <LoginSection
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                submitLogin={submitLogin}
            />
        </div>
    );
};

export default Login;
