import { motion, AnimatePresence } from "framer-motion";

function TransitionOverlay({ show }) {
    return (
        <AnimatePresence>

            {show && (

                <motion.div
                    className="transition-overlay"

                    initial={{
                        opacity: 0
                    }}

                    animate={{
                        opacity: 1
                    }}

                    exit={{
                        opacity: 0
                    }}

                    transition={{
                        duration: .5
                    }}
                >

                    <motion.div
                        className="energy-circle"

                        initial={{
                            scale: 0
                        }}

                        animate={{
                            scale: 25
                        }}

                        transition={{
                            duration: .9,
                            ease: "easeOut"
                        }}
                    />

                    <motion.div
                        className="energy-wave"

                        initial={{
                            x: "-100%"
                        }}

                        animate={{
                            x: "100%"
                        }}

                        transition={{
                            duration: .9
                        }}
                    />

                </motion.div>

            )}

        </AnimatePresence>
    );
}

export default TransitionOverlay;