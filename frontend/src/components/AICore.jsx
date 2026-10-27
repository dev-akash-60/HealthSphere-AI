import { motion } from "framer-motion";

function AICore() {
    const modules = [
        {
            icon: "🧠",
            name: "Symptoms",
            position: "symptoms",
        },
        {
            icon: "📄",
            name: "Reports",
            position: "reports",
        },
        {
            icon: "🩻",
            name: "X-Ray",
            position: "xray",
        },
        {
            icon: "🩹",
            name: "Skin AI",
            position: "skin",
        },
    ];

    return (
        <div className="ai-core-container">

            {/* Orbiting Rings */}
            <motion.div
                className="orbit orbit-one"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            <motion.div
                className="orbit orbit-two"
                animate={{ rotate: -360 }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* AI Core */}
            <motion.div
                className="ai-core"
                animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                        "0 0 30px rgba(56,189,248,0.4)",
                        "0 0 80px rgba(56,189,248,0.8)",
                        "0 0 30px rgba(56,189,248,0.4)",
                    ],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            >
                <span className="core-icon">🩺</span>

                <h3>AI HEALTH CORE</h3>

                <p>Intelligent Analysis</p>
            </motion.div>

            {/* Floating Modules */}
            {modules.map((module, index) => (
                <motion.div
                    key={module.name}
                    className={`floating-module ${module.position}`}
                    initial={{
                        opacity: 0,
                        scale: 0,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -10, 0],
                    }}
                    transition={{
                        opacity: {
                            delay: index * 0.4,
                            duration: 0.6,
                        },
                        scale: {
                            delay: index * 0.4,
                            duration: 0.6,
                        },
                        y: {
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5,
                        },
                    }}
                >
                    <span>{module.icon}</span>

                    <p>{module.name}</p>
                </motion.div>
            ))}

        </div>
    );
}

export default AICore;