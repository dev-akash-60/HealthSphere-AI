import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="auth-loading">
                <div className="auth-spinner"></div>
                <p>Verifying your session...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;