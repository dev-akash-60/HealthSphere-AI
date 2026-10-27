import { motion } from "framer-motion";
import AICore from "../components/AICore";
import BackgroundAnimation from "../components/BackgroundAnimation";
import FeatureCard from "../components/FeatureCard";
import { useNavigate } from "react-router-dom";


function LandingPage() {
    const navigate = useNavigate();
    
    return (
        <div className="landing-page">

            {/* Animated Background */}
            <BackgroundAnimation />

            {/* ================= NAVBAR ================= */}
            <motion.nav
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2>HealthSphere AI</h2>

                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#about">About</a>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </motion.button>
                </div>
            </motion.nav>

            <main>

                {/* ================= HERO SECTION ================= */}
                <section className="hero-section">

                    {/* LEFT SIDE */}
                    <div className="hero-content">

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            AI-POWERED HEALTHCARE
                        </motion.p>

                        {/* Animated Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                            }}
                        >
                            Your Health.
                            <br />

                            <span className="gradient-text">
                                One Intelligent
                            </span>

                            <br />

                            Ecosystem.
                        </motion.h1>

                        {/* Animated Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.4,
                            }}
                        >
                            Analyze symptoms, medical reports, and medical
                            images with intelligent AI-powered healthcare
                            assistance.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="hero-buttons"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.6,
                            }}
                        >
                            <motion.button
                                className="primary-button"
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                onClick={() => navigate("/login")}
                            >
                                Start Health Analysis
                            </motion.button>

                            <motion.button
                                className="secondary-button"
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                onClick={() => navigate("/login")}
                            >
                                Explore Platform
                            </motion.button>
                        </motion.div>

                        {/* Trust Information */}
                        <motion.div
                            className="hero-trust"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 1,
                                delay: 1,
                            }}
                        >
                            <span>✓ AI-Assisted</span>
                            <span>✓ Multiple AI Models</span>
                            <span>✓ Personalised Insights</span>
                        </motion.div>

                    </div>

                    {/* RIGHT SIDE */}
                    <motion.div
                        className="hero-visual"
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.3,
                        }}
                    >
                        <AICore />
                    </motion.div>

                </section>


                {/* ================= STATS SECTION ================= */}
                <section className="stats-section">

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3>06+</h3>
                        <p>AI Healthcare Modules</p>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3>01</h3>
                        <p>Unified Healthcare Platform</p>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3>AI</h3>
                        <p>Powered Health Insights</p>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3>24/7</h3>
                        <p>Digital Health Assistance</p>
                    </motion.div>

                </section>


                {/* ================= FEATURES SECTION ================= */}
                <section
                    id="features"
                    className="features-section"
                >

                    <motion.div
                        className="section-heading"
                        initial={{
                            opacity: 0,
                            y: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                    >

                        <p>AI-POWERED HEALTHCARE</p>

                        <h2>
                            One Platform.
                            <br />
                            Multiple Ways to Understand Your Health.
                        </h2>

                        <span>
                            From symptoms to medical imaging, intelligent AI
                            tools help you understand your health information.
                        </span>

                    </motion.div>


                    <div className="features-grid">

                        <FeatureCard
                            icon="🧠"
                            title="AI Symptom Prediction"
                            description="Analyse symptoms and identify possible health conditions using machine learning."
                        />

                        <FeatureCard
                            icon="📄"
                            title="Medical Report Analysis"
                            description="Extract and summarise important information from medical reports."
                        />

                        <FeatureCard
                            icon="🩻"
                            title="AI X-Ray Analysis"
                            description="Analyse supported medical images using deep learning models."
                        />

                        <FeatureCard
                            icon="🩹"
                            title="Skin Disease Detection"
                            description="Analyse skin images and identify possible skin conditions."
                        />

                        <FeatureCard
                            icon="🤖"
                            title="AI Healthcare Chatbot"
                            description="Ask general health-related questions and receive AI-assisted explanations."
                        />

                        <FeatureCard
                            icon="🚨"
                            title="Emergency Risk Detection"
                            description="Identify potentially urgent symptoms and provide appropriate warnings."
                        />

                        <FeatureCard
                            icon="💊"
                            title="Smart Recommendations"
                            description="Receive personalised health guidance based on AI analysis."
                        />

                        <FeatureCard
                            icon="📊"
                            title="Personal Health Dashboard"
                            description="Track predictions, reports, health insights, and analytics in one place."
                        />

                    </div>

                </section>


                {/* ================= HOW IT WORKS ================= */}
                <section
                    id="how-it-works"
                    className="how-it-works-section"
                >

                    <motion.div
                        className="section-heading"
                        initial={{
                            opacity: 0,
                            y: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                    >

                        <p>HOW IT WORKS</p>

                        <h2>
                            From Health Data
                            <br />
                            to Intelligent Insights.
                        </h2>

                        <span>
                            HealthSphere AI brings different healthcare AI
                            technologies together into one intelligent workflow.
                        </span>

                    </motion.div>


                    <div className="workflow">

                        <motion.div
                            className="workflow-step"
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                        >
                            <div className="step-number">01</div>

                            <div className="step-icon">📥</div>

                            <h3>Provide Health Data</h3>

                            <p>
                                Enter symptoms, upload medical reports,
                                or provide supported medical images.
                            </p>
                        </motion.div>


                        <div className="workflow-line"></div>


                        <motion.div
                            className="workflow-step"
                            initial={{
                                opacity: 0,
                                y: 50,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: 0.2,
                            }}
                        >
                            <div className="step-number">02</div>

                            <div className="step-icon">⚙️</div>

                            <h3>AI Analysis</h3>

                            <p>
                                Machine learning and AI models analyse the
                                provided healthcare information.
                            </p>
                        </motion.div>


                        <div className="workflow-line"></div>


                        <motion.div
                            className="workflow-step"
                            initial={{
                                opacity: 0,
                                x: 50,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: 0.4,
                            }}
                        >
                            <div className="step-number">03</div>

                            <div className="step-icon">💡</div>

                            <h3>Receive Insights</h3>

                            <p>
                                Get AI-assisted health insights, risk
                                information, and personalised guidance.
                            </p>
                        </motion.div>

                    </div>

                </section>


                {/* ================= ABOUT SECTION ================= */}
                {/* ================= ABOUT / TEAM SECTION ================= */}

                <section
                    id="about"
                    className="about-section"
                >

                    <motion.div
                        className="about-container"

                        initial={{
                            opacity: 0,
                            y: 50,
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}

                        viewport={{
                            once: true,
                        }}
                    >

                        {/* LEFT SIDE: ABOUT PROJECT */}

                        <div className="about-content">

                            <p className="about-label">
                                THE FUTURE OF DIGITAL HEALTHCARE
                            </p>

                            <h2>
                                Intelligent Technology.
                                <br />
                                Better Health Understanding.
                            </h2>

                            <p>
                                HealthSphere AI is designed as an AI-powered healthcare
                                ecosystem that combines machine learning, computer vision,
                                natural language processing, and intelligent recommendations
                                into one unified platform.
                            </p>

                            

                        </div>


                        {/* RIGHT SIDE: TEAM MEMBERS */}

                        <div className="team-section">

                            <p className="team-label">
                                MEET THE TEAM
                            </p>

                            <div className="team-members">

                                {/* TEAM MEMBER 1 */}

                                <motion.div
                                    className="team-member"

                                    initial={{
                                        opacity: 0,
                                        x: -50,
                                    }}

                                    whileInView={{
                                        opacity: 1,
                                        x: 0,
                                    }}

                                    viewport={{
                                        once: true,
                                    }}

                                    transition={{
                                        duration: 0.7,
                                    }}
                                >

                                    <motion.div
                                        className="profile-image-wrapper"

                                        animate={{
                                            y: [0, -10, 0],
                                        }}

                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >

                                        <img
                                            src="/Akash_Ghosh.jpg"
                                            alt="Team Member 1"
                                            className="profile-image"
                                        />

                                    </motion.div>

                                    <h3>Akash Ghosh</h3>

                                    <p className="team-role">
                                        AI/ML Developer
                                    </p>

                                    <div className="contact-links">

                                        <a
                                            href="mailto:your-email@example.com"
                                        >
                                            <img
                                                src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png"
                                                alt="Email"
                                                width="15"
                                                height="15"
                                            />
                                        </a>

                                        <a
                                            href="https://github.com/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src="https://www.bing.com/th/id/OIP.uwTXeoRua-yoEcS-HY40QgHaHa?w=193&h=193&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2"
                                                alt="GitHub"
                                                width="15"
                                                height="15"
                                            />
                                        </a>

                                        <a
                                            href="https://linkedin.com/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                                                alt="LinkedIn"
                                                width="15"
                                                height="15"
                                            />
                                        </a>
                                    </div>

                                </motion.div>


                                {/* TEAM MEMBER 2 */}

                                <motion.div
                                    className="team-member"

                                    initial={{
                                        opacity: 0,
                                        x: 50,
                                    }}

                                    whileInView={{
                                        opacity: 1,
                                        x: 0,
                                    }}

                                    viewport={{
                                        once: true,
                                    }}

                                    transition={{
                                        duration: 0.7,
                                        delay: 0.2,
                                    }}
                                >

                                    <motion.div
                                        className="profile-image-wrapper"

                                        animate={{
                                            y: [0, -10, 0],
                                        }}

                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 1,
                                        }}
                                    >

                                        <img
                                            src="/Swagato_De.jpeg"
                                            alt="Team Member 2"
                                            className="profile-image"
                                        />

                                    </motion.div>

                                    <h3>Swagato De</h3>

                                    <p className="team-role">
                                        Full Stack Developer
                                    </p>

                                    <div className="contact-links">

                                        <a
                                            href="mailto:friend-email@example.com"
                                        >
                                            <img
                                                src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png"
                                                alt="Email"
                                                width="15"
                                                height="15"
                                            />
                                        </a>

                                        <a
                                            href="https://github.com/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src="https://www.bing.com/th/id/OIP.uwTXeoRua-yoEcS-HY40QgHaHa?w=193&h=193&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2"
                                                alt="GitHub"
                                                width="15"
                                                height="15"
                                            />
                                        </a>

                                        <a
                                            href="https://linkedin.com/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                                                alt="LinkedIn"
                                                width="15"
                                                height="15"
                                            />
                                        </a>

                                    </div>

                                </motion.div>

                            </div>

                        </div>

                    </motion.div>

                </section>


                {/* ================= FOOTER ================= */}
                <footer className="footer">

                    <div>
                        <h2>HealthSphere AI</h2>

                        <p>
                            An AI-powered healthcare ecosystem for intelligent
                            health analysis.
                        </p>
                    </div>

                    <div>
                        <p>
                            AI-assisted healthcare information is not a
                            substitute for professional medical advice.
                        </p>
                    </div>

                </footer>

            </main>

        </div>
    );
}

export default LandingPage;