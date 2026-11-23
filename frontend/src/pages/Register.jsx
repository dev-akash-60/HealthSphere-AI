import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";
import TransitionOverlay from "../components/TransitionOverlay";

function Register() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await registerUser(name.trim(), email.trim(), password);

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 850);

        } catch (err) {
            setLoading(false);

            const errorMessages = {
                "auth/email-already-in-use": "This email is already registered.",
                "auth/invalid-email": "Please enter a valid email address.",
                "auth/weak-password": "Please choose a stronger password.",
                "auth/network-request-failed": "Network error. Check your connection."
            };

            setError(
                errorMessages[err.code] ||
                "Unable to create your account. Please try again."
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

                    <h1>Create Account</h1>

                    <p className="subtitle">
                        Join HealthSphere AI
                    </p>

                    <form onSubmit={handleRegister}>

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />

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
                                autoComplete="new-password"
                                minLength={6}
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

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />

                        {error && (
                            <p className="auth-error">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </button>

                    </form>

                    <p className="switch-text">
                        Already have an account?

                        <Link to="/login" className="link-button">
                            Login
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;