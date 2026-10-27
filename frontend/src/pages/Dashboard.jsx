import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Bell,
    Bot,
    Brain,
    CheckCircle2,
    FileText,
    HeartPulse,
    Image,
    Info,
    Pill,
    ScanLine,
    ShieldCheck,
    Sparkles,
    UserRound,
    Zap,
} from "lucide-react";

const stats = [
    {
        title: "Health Score",
        value: "85%",
        detail: "Your wellness overview",
        icon: HeartPulse,
        tone: "violet",
    },
    {
        title: "AI Predictions",
        value: "24",
        detail: "Analyses completed",
        icon: Brain,
        tone: "cyan",
    },
    {
        title: "Medical Reports",
        value: "12",
        detail: "Reports in your workspace",
        icon: FileText,
        tone: "pink",
    },
    {
        title: "Risk Level",
        value: "LOW",
        detail: "Based on demo dashboard data",
        icon: ShieldCheck,
        tone: "green",
    },
];

const modules = [
    {
        title: "Symptom Prediction",
        description:
            "Explore possible conditions based on the symptoms you enter.",
        icon: Activity,
        path: "/symptoms",
        category: "AI DIAGNOSTICS",
        tone: "violet",
    },
    {
        title: "Medical Reports",
        description:
            "Review and understand your medical report information.",
        icon: FileText,
        path: "/report-analysis",
        category: "REPORT INSIGHTS",
        tone: "cyan",
    },
    {
        title: "X-Ray Analysis",
        description:
            "Upload an X-ray image for AI-assisted image analysis.",
        icon: ScanLine,
        path: "/xray-analysis",
        category: "COMPUTER VISION",
        tone: "blue",
    },
    {
        title: "Skin Detection",
        description:
            "Explore skin-image analysis with your AI healthcare tools.",
        icon: Image,
        path: "/skin-disease",
        category: "IMAGE ANALYSIS",
        tone: "pink",
    },
    {
        title: "AI Assistant",
        description:
            "Ask health-related questions through your digital assistant.",
        icon: Bot,
        path: "/chatbot",
        category: "SMART ASSISTANT",
        tone: "green",
    },
    {
        title: "Medicine AI",
        description:
            "Explore medicine-related information with your health tools.",
        icon: Pill,
        path: "/medicine",
        category: "HEALTH TOOLS",
        tone: "orange",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 22,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
        },
    },
};

function Dashboard() {
    const navigate = useNavigate();

    return (
        <main className="dashboard-container">
            <div className="dashboard-background-glow dashboard-glow-one" />
            <div className="dashboard-background-glow dashboard-glow-two" />
            <div className="dashboard-grid-overlay" />

            {/* Top navigation */}
            <motion.nav
                className="dashboard-navbar"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
            >
                <button
                    className="dashboard-brand"
                    onClick={() => navigate("/dashboard")}
                    aria-label="HealthSphere AI home"
                >
                    <span className="brand-mark">
                        <HeartPulse size={25} strokeWidth={2.2} />
                        <span className="brand-mark-dot" />
                    </span>

                    <span className="brand-copy">
                        <span className="brand-name">
                            HealthSphere<span> AI</span>
                        </span>
                        <span className="brand-caption">INTELLIGENT HEALTHCARE</span>
                    </span>
                </button>

                <div className="navbar-center">
                    <span className="navbar-active-dot" />
                    Your Health Workspace
                </div>

                <div className="nav-actions">
                    <button
                        className="nav-icon-button about-action"
                        onClick={() => navigate("/dashboard")}
                        aria-label="About HealthSphere AI"
                        title="About HealthSphere AI"
                    >
                        <Info size={18} />
                    </button>

                    <button
                        className="nav-icon-button notification-action"
                        aria-label="Notifications"
                        title="Notifications"
                        onClick={() => navigate("/dashboard")}
                    >
                        <Bell size={18} />
                        <span className="notification-dot" />
                    </button>

                    <button
                        className="profile-button"
                        onClick={() => navigate("/profile")}
                        aria-label="Open profile"
                    >
                        <span className="profile-avatar">
                            <UserRound size={19} />
                        </span>
                        <span className="profile-button-text">My Profile</span>
                        <ArrowUpRight size={15} className="profile-arrow" />
                    </button>
                </div>
            </motion.nav>

            {/* Hero section */}
            <motion.section
                className="dashboard-hero"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                <div className="hero-copy">
                    <div className="hero-eyebrow">
                        <Sparkles size={15} />
                        <span>YOUR PERSONAL AI HEALTH SPACE</span>
                    </div>

                    <h1>
                        Your health.
                        <br />
                        <span className="hero-gradient-text">A smarter perspective.</span>
                    </h1>

                    <p className="hero-description">
                        Discover your health insights with intelligent tools designed to
                        help you explore symptoms, understand reports, and navigate your
                        healthcare journey.
                    </p>

                    <div className="hero-buttons">
                        <motion.button
                            className="premium-button primary-button"
                            whileHover={{ y: -3, scale: 1.015 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/symptoms")}
                        >
                            <span className="button-icon-wrap">
                                <Zap size={18} fill="currentColor" />
                            </span>
                            Start Health Analysis
                            <ArrowRight size={18} className="button-arrow" />
                        </motion.button>

                        <motion.button
                            className="premium-button secondary-button"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/chatbot")}
                        >
                            <Bot size={19} />
                            Talk to AI Assistant
                        </motion.button>
                    </div>

                    <div className="hero-trust-row">
                        <span className="trust-icon">
                            <ShieldCheck size={16} />
                        </span>
                        <span>Designed for smarter health exploration</span>
                        <span className="trust-separator">•</span>
                        <span className="trust-highlight">AI-powered tools</span>
                    </div>
                </div>

                {/* Decorative AI visual */}
                <div className="hero-visual">
                    <div className="visual-top-label">
                        <span className="visual-live-dot" />
                        HEALTHSPHERE CORE
                    </div>

                    <div className="orbit-scene">
                        <div className="orbit orbit-outer" />
                        <div className="orbit orbit-middle" />
                        <div className="orbit orbit-inner" />

                        <div className="orbit-node orbit-node-one">
                            <HeartPulse size={19} />
                        </div>
                        <div className="orbit-node orbit-node-two">
                            <Brain size={18} />
                        </div>
                        <div className="orbit-node orbit-node-three">
                            <Activity size={18} />
                        </div>

                        <div className="core-glow" />
                        <div className="core-circle">
                            <div className="core-circle-inner">
                                <HeartPulse size={47} strokeWidth={1.6} />
                            </div>
                        </div>
                    </div>

                    <div className="visual-bottom-card">
                        <div className="visual-bottom-icon">
                            <Sparkles size={17} />
                        </div>
                        <div className="visual-bottom-copy">
                            <strong>Intelligence meets wellness</strong>
                            <span>Your digital healthcare toolkit</span>
                        </div>
                        <ArrowUpRight size={17} className="visual-bottom-arrow" />
                    </div>

                    <div className="floating-chip floating-chip-top">
                        <span className="chip-pulse" />
                        AI tools ready
                    </div>

                    <div className="floating-chip floating-chip-bottom">
                        <CheckCircle2 size={15} />
                        Unified workspace
                    </div>
                </div>
            </motion.section>

            {/* Section heading */}
            <motion.div
                className="dashboard-section-heading"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div>
                    <span className="section-eyebrow">YOUR OVERVIEW</span>
                    <h2>Health at a glance<span>.</span></h2>
                    <p>A quick look at your current dashboard summary.</p>
                </div>

                <div className="overview-badge">
                    <Activity size={16} />
                    <span>Dashboard overview</span>
                </div>
            </motion.div>

            {/* Statistics */}
            <motion.section
                className="stats-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <motion.article
                            className={`dashboard-stat-card tone-${stat.tone}`}
                            key={stat.title}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                        >
                            <div className="stat-card-top">
                                <div className="stat-icon">
                                    <Icon size={21} strokeWidth={1.9} />
                                </div>

                                <span className="stat-mini-icon">
                                    <ArrowUpRight size={17} />
                                </span>
                            </div>

                            <p className="stat-title">{stat.title}</p>
                            <div className="stat-value">{stat.value}</div>
                            <p className="stat-detail">{stat.detail}</p>

                            <div className="stat-bottom-line">
                                <span />
                            </div>
                        </motion.article>
                    );
                })}
            </motion.section>

            {/* Healthcare modules */}
            <section className="modules-section">
                <motion.div
                    className="dashboard-section-heading modules-heading"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <span className="section-eyebrow">EXPLORE THE PLATFORM</span>
                        <h2>Your AI health toolkit<span>.</span></h2>
                        <p>Choose a module to get started with your health journey.</p>
                    </div>

                    <div className="module-count">
                        <span>06</span>
                        <div>
                            <strong>AI modules</strong>
                            <small>One connected platform</small>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="modules-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.08 }}
                >
                    {modules.map((module, index) => {
                        const Icon = module.icon;

                        return (
                            <motion.article
                                className={`module-card module-${module.tone}`}
                                key={module.title}
                                variants={itemVariants}
                                whileHover={{ y: -7 }}
                                onClick={() => navigate(module.path)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        navigate(module.path);
                                    }
                                }}
                                aria-label={`Open ${module.title}`}
                            >
                                <div className="module-card-top">
                                    <div className="module-icon">
                                        <Icon size={24} strokeWidth={1.8} />
                                    </div>

                                    <span className="module-index">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <span className="module-category">{module.category}</span>
                                <h3>{module.title}</h3>
                                <p>{module.description}</p>

                                <div className="module-card-footer">
                                    <span>Explore module</span>
                                    <span className="module-arrow">
                                        <ArrowUpRight size={18} />
                                    </span>
                                </div>

                                <div className="module-card-shine" />
                            </motion.article>
                        );
                    })}
                </motion.div>
            </section>

            {/* Footer note */}
            <footer className="dashboard-footer">
                <div className="footer-brand-mark">
                    <HeartPulse size={17} />
                </div>

                <p>
                    <strong>HealthSphere AI</strong>
                    <span>Intelligent tools for your healthcare journey.</span>
                </p>

                <span className="footer-disclaimer">
                    AI insights are informational and are not a substitute for
                    professional medical advice.
                </span>
            </footer>
        </main>
    );
}

export default Dashboard;