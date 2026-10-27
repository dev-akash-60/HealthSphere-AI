import { motion } from "framer-motion";
<section id="features" className="features-section">

    <div className="section-heading">
        <p>AI-POWERED HEALTHCARE</p>

        <h2>
            One Platform.
            <br />
            Multiple Ways to Understand Your Health.
        </h2>

        <span>
            From symptoms to medical imaging, intelligent AI tools
            help you understand your health information.
        </span>
    </div>

    <div className="features-grid">

        <FeatureCard
            icon="🧠"
            title="AI Symptom Prediction"
            description="Analyze symptoms and identify possible health conditions using machine learning."
        />

        <FeatureCard
            icon="📄"
            title="Medical Report Analysis"
            description="Extract and summarize important information from medical reports."
        />

        <FeatureCard
            icon="🩻"
            title="AI X-Ray Analysis"
            description="Analyze supported medical images using deep learning models."
        />

        <FeatureCard
            icon="🩹"
            title="Skin Disease Detection"
            description="Analyze skin images and identify possible skin conditions."
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
            description="Receive personalized health guidance based on AI analysis."
        />

        <FeatureCard
            icon="📊"
            title="Personal Health Dashboard"
            description="Track predictions, reports, health insights, and analytics in one place."
        />

    </div>

</section>

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            className="feature-card"
            initial={{
                opacity: 0,
                y: 50,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -10,
                scale: 1.03,
            }}
            transition={{
                duration: 0.6,
            }}
            viewport={{
                once: true,
            }}
        >
            <div className="feature-icon">
                {icon}
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            <span className="feature-arrow">
                →
            </span>
        </motion.div>
    );
}

export default FeatureCard;