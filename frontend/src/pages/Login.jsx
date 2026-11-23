import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";
import TransitionOverlay from "../components/TransitionOverlay";

function Login() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await loginUser(email.trim(), password);

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 850);

        } catch (err) {
            setLoading(false);

            const errorMessages = {
                "auth/invalid-email": "Please enter a valid email address.",
                "auth/invalid-credential": "Incorrect email or password.",
                "auth/user-not-found": "No account found with this email.",
                "auth/wrong-password": "Incorrect password.",
                "auth/too-many-requests": "Too many attempts. Try again later.",
                "auth/network-request-failed": "Network error. Check your connection."
            };

            setError(
                errorMessages[err.code] ||
                "Unable to login. Please try again."
            );
        }
    };

    if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
        return null;
    }

    return (
        <div className="auth-page">

            <TransitionOverlay show={loading} />

            <div className="cyber-card">

                <div className="glow-border"></div>

                <div className="auth-content">

                    <h1>Welcome Back</h1>

                    <p className="subtitle">
                        Login to HealthSphere AI
                    </p>

                    <form onSubmit={handleLogin}>

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />

                        <div className="password-wrapper">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                        {error && (
                            <p className="auth-error">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <p className="switch-text">
                        Don't have an account?

                        <Link to="/register" className="link-button">
                            Register
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;