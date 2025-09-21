import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const JWTContext = createContext();

export const JWTProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // On mount, check for token in cookies
    useEffect(() => {
        const cookieToken = Cookies.get("token");
        const cookieUser = Cookies.get("user");
        if (cookieToken) setToken(cookieToken);
        if (cookieUser) setUser(JSON.parse(cookieUser));
    }, []);

    // Sync token/user to cookies when they change
    useEffect(() => {
        if (token) {
            Cookies.set("token", token, { expires: 7 });
        } else {
            Cookies.remove("token");
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            Cookies.set("user", JSON.stringify(user), { expires: 7 });
        } else {
            Cookies.remove("user");
        }
    }, [user]);

    return (
        <JWTContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </JWTContext.Provider>
    );
};

export default JWTContext;
