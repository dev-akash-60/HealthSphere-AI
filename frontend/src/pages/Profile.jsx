
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

import "../styles/profile.css";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            setPhotoURL(user.photoURL || "");
            setPreviewImage(user.photoURL || "");
        }
    }, [user]);

    const getInitials = () => {
        const displayName = name || user?.email || "User";

        return displayName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join("");
    };

    const handlePhotoChange = (e) => {
        const value = e.target.value.trim();

        setPhotoURL(e.target.value);
        setPreviewImage(value);
        setError("");
        setMessage("");
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!auth.currentUser) {
            setError("Your session has expired. Please log in again.");
            return;
        }

        try {
            setSaving(true);

            const updatedName = name.trim();
            const updatedPhoto = photoURL.trim();

            await updateProfile(auth.currentUser, {
                displayName: updatedName,
                photoURL: updatedPhoto || null
            });

            // Refresh Firebase user data
            await auth.currentUser.reload();

            const updatedUser = auth.currentUser;

            // Update the local profile immediately
            setName(updatedUser.displayName || updatedName);
            setPhotoURL(updatedUser.photoURL || "");
            setPreviewImage(updatedUser.photoURL || "");

            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Profile update error:", err);
            setError(err.message || "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logoutUser();
            navigate("/login", { replace: true });
        } catch (err) {
            console.error("Logout error:", err);
            setError("Unable to log out. Please try again.");
            setLoggingOut(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-page">

            <div className="profile-header">
                <div>
                    <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account details.</p>
                </div>

                <div className="profile-status">
                    <span className="status-dot"></span>
                    Active Account
                </div>
            </div>

            <div className="profile-container">

                {/* Profile Overview */}
                <section className="profile-card profile-overview">

                    <div className="profile-avatar">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile"
                                onError={() => setPreviewImage("")}
                            />
                        ) : (
                            <span>{getInitials()}</span>
                        )}

                        <div className="avatar-online"></div>
                    </div>

                    <div className="profile-overview-info">
                        <h2>{name || "HealthSphere User"}</h2>
                        <p>{user.email}</p>

                        <span className="profile-member-badge">
                            ✦ HealthSphere Member
                        </span>
                    </div>

                </section>

                {/* Personal Information */}
                <section className="profile-card">

                    <div className="profile-section-heading">
                        <div>
                            <h2>Personal Information</h2>
                            <p>Update your profile information below.</p>
                        </div>
                        <span className="profile-section-icon">◈</span>
                    </div>

                    <form onSubmit={handleSave}>

                        <div className="profile-form-grid">

                            <div className="profile-field">
                                <label htmlFor="profile-name">Full Name</label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="profile-email">Email Address</label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    value={user.email || ""}
                                    readOnly
                                    disabled
                                />
                                <small>Email is managed through Firebase Authentication.</small>
                            </div>

                            <div className="profile-field full-width">
                                <label htmlFor="profile-photo">Profile Image URL</label>
                                <input
                                    id="profile-photo"
                                    type="url"
                                    placeholder="https://example.com/profile.jpg"
                                    value={photoURL}
                                    onChange={handlePhotoChange}
                                />
                                <small>Use a publicly accessible image URL.</small>
                            </div>

                        </div>

                        {message && (
                            <div className="profile-message success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="profile-message error-message">
                                {error}
                            </div>
                        )}

                        <div className="profile-form-actions">

                            <button
                                type="button"
                                className="profile-reset-btn"
                                onClick={() => {
                                    setName(user.displayName || "");
                                    setPhotoURL(user.photoURL || "");
                                    setPreviewImage(user.photoURL || "");
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                className="profile-save-btn"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </div>
                    </form>
                </section>

                {/* Account Information */}
                <section className="profile-card">

                    <div className="profile-section-heading">
                        <div>
                            <h2>Account Information</h2>
                            <p>Your account and authentication details.</p>
                        </div>
                        <span className="profile-section-icon">◎</span>
                    </div>

                    <div className="account-details">

                        <div className="account-detail-row">
                            <div>
                                <span className="detail-label">Account Status</span>
                                <span className="detail-value">Active</span>
                            </div>
                            <span className="detail-status">Active Session</span>
                        </div>

                        <div className="account-detail-row">
                            <div>
                                <span className="detail-label">Email Verification</span>
                                <span className="detail-value">
                                    {user.emailVerified ? "Verified" : "Not verified"}
                                </span>
                            </div>

                            <span className={`verification-badge ${user.emailVerified ? "verified" : "unverified"}`}>
                                {user.emailVerified ? "Verified" : "Pending"}
                            </span>
                        </div>

                        <div className="account-detail-row">
                            <div>
                                <span className="detail-label">Authentication Provider</span>
                                <span className="detail-value">
                                    {user.providerData?.[0]?.providerId || "Firebase"}
                                </span>
                            </div>
                        </div>

                        <div className="account-detail-row">
                            <div>
                                <span className="detail-label">Account Created</span>
                                <span className="detail-value">
                                    {user.metadata?.creationTime
                                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                                        : "Not available"}
                                </span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Security */}
                <section className="profile-card profile-security">
                    <div>
                        <h2>Account Security</h2>
                        <p>Keep your HealthSphere AI account secure.</p>
                    </div>

                    <button
                        className="profile-logout-btn"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? "Logging out..." : "↗ Log Out"}
                    </button>
                </section>

            </div>

            <div className="profile-footer">
                <span>HealthSphere AI</span>
                <p>Your Health. One Intelligent Ecosystem.</p>
            </div>

        </div>
    );
}

export default Profile;
