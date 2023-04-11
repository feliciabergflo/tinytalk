import { createContext, useState } from "react";

const AuthContext = createContext({}); // Fills with empty object

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children} {/* represents the components inside AuthProvider */}
        </AuthContext.Provider>
    )
}

export default AuthContext;