
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css"

function DashboardNavbar() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getInitials = () => {
        const name = user?.displayName || user?.email || "User";

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join("");
    };

    return (
        <nav className="dashboard-navbar">

            <div className="navbar-brand">
                <h2>HealthSphere AI</h2>
                <p>Intelligent Healthcare Platform</p>
            </div>

            <div className="navbar-actions">

                <button
                    type="button"
                    className="navbar-icon-btn"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </button>

                <button
                    type="button"
                    className="profile-circle"
                    onClick={() => navigate("/profile")}
                    aria-label="Open profile"
                    title="My Profile"
                >
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <span>{getInitials()}</span>
                    )}
                </button>

            </div>

        </nav>
    );
}

export default DashboardNavbar;
