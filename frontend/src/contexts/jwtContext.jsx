import { createContext, useState } from "react";

const JWTContext = createContext();

export const JWTProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    return (
        <JWTContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </JWTContext.Provider>
    );
};

export default JWTContext;
