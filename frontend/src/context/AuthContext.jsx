import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                authLoading,
                isAuthenticated: Boolean(user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};