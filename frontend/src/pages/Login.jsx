import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/auth.css";

import TransitionOverlay from "../components/TransitionOverlay";


function Login() {


    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);



    const handleLogin = () => {

        // Later replace this with backend authentication

        localStorage.setItem("isLoggedIn", "true");


        setLoading(true);


        setTimeout(() => {

            navigate("/dashboard");

        }, 850);

    };



    const switchRegister = () => {


        setLoading(true);


        setTimeout(() => {

            navigate("/register");

        }, 850);

    };



    return (

        <div className="auth-page">


            <TransitionOverlay show={loading} />



            <div className="cyber-card">


                <div className="glow-border"></div>



                <div className="auth-content">


                    <h1>
                        Welcome Back
                    </h1>



                    <p className="subtitle">
                        Login to HealthSphere AI
                    </p>




                    <input
                        type="email"
                        placeholder="Email Address"
                    />



                    <input
                        type="password"
                        placeholder="Password"
                    />



                    <button
                        className="auth-btn"
                        onClick={handleLogin}
                    >

                        Login

                    </button>




                    <p className="switch-text">


                        Don't have an account?



                        <button
                            className="link-button"
                            onClick={switchRegister}
                        >

                            Register

                        </button>


                    </p>



                </div>


            </div>


        </div>

    );

}


export default Login;