import { motion } from "framer-motion";

function PageTransition({ children }) {
    return (
        <motion.div
            className="page-transition"
            initial={{
                opacity: 0,
                scale: 0.96,
                filter: "blur(12px)"
            }}
            animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)"
            }}
            exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(12px)"
            }}
            transition={{
                duration: 0.55,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
}

export default PageTransition;