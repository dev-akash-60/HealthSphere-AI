import { Link } from "react-router-dom";
import "../styles/auth.css";
const handleRegister = () => {

    localStorage.setItem("isLoggedIn", "true");

    navigate("/dashboard");

};


function Register() {

    return (

        <div className="auth-page">


            <div className="cyber-card">

                <div className="glow-border"></div>


                <div className="auth-content">


                    <h1>
                        Create Account
                    </h1>


                    <p className="subtitle">
                        Join HealthSphere AI
                    </p>



                    <input
                        type="text"
                        placeholder="Full Name"
                    />


                    <input
                        type="email"
                        placeholder="Email Address"
                    />


                    <input
                        type="password"
                        placeholder="Password"
                    />


                    <input
                        type="password"
                        placeholder="Confirm Password"
                    />



                    <button
                        className="auth-btn"
                        onClick={handleRegister}
                    >
                        Register
                    </button>



                    <p className="switch-text">

                        Already have an account?

                        <Link to="/login">
                            Login
                        </Link>

                    </p>


                </div>


            </div>


        </div>

    )

}


export default Register;