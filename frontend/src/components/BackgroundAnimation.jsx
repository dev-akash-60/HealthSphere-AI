
import { motion } from "framer-motion";

const BackgroundAnimation = () => {
    return (
        <div className="animated-background">
            {/* Glowing orbs */}
            <motion.div
                className="glow-orb orb-one"
                animate={{
                    x: [0, 70, -30, 0],
                    y: [0, -50, 40, 0],
                    scale: [1, 1.15, 0.9, 1]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="glow-orb orb-two"
                animate={{
                    x: [0, -60, 30, 0],
                    y: [0, 50, -40, 0],
                    scale: [1, 0.85, 1.2, 1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="glow-orb orb-three"
                animate={{
                    y: [0, -70, 0],
                    x: [0, 40, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Grid overlay */}
            <div className="background-grid" />
        </div>
    );
};

export default BackgroundAnimation;
