import { motion } from "framer-motion";

function AICoreDashboard() {

    return (

        <div className="ai-core-dashboard">

            <motion.div
                className="core-circle"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: 360
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >

                <div className="core-inner">
                    AI
                </div>

            </motion.div>


            <h3>
                HealthSphere Engine
            </h3>


            <p>
                AI System Active
            </p>


            <div className="status-dot">
                ● Online
            </div>


        </div>

    );

}

export default AICoreDashboard;