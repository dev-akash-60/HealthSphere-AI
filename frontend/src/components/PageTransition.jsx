
import { motion, useReducedMotion } from "framer-motion";

const PageTransition = ({ children }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 25,
                filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)"
            }}
            animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)"
            }}
            exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : -15,
                filter: shouldReduceMotion ? "blur(0px)" : "blur(5px)"
            }}
            transition={{
                duration: shouldReduceMotion ? 0.15 : 0.6,
                ease: [0.22, 1, 0.36, 1]
            }}
            style={{
                width: "100%",
                minHeight: "100vh"
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
