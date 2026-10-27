import { motion } from "framer-motion";

function BackgroundAnimation() {
    const particles = Array.from({ length: 20 });

    return (
        <div className="background-animation">
            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            {particles.map((_, index) => (
                <motion.span
                    key={index}
                    className="particle"
                    initial={{
                        opacity: 0,
                        y: 0,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: [-20, -120],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}

export default BackgroundAnimation;