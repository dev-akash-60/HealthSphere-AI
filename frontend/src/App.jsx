import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// =====================================================
// PAGES
// =====================================================

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Symptoms from "./pages/Symptoms";
import SymptomPrediction from "./pages/SymptomPrediction";

import ReportAnalysis from "./pages/ReportAnalysis";
import SkinDisease from "./pages/SkinDisease";
import XrayAnalysis from "./pages/XrayAnalysis";
import Chatbot from "./pages/Chatbot";
import MedicineRecommendation from "./pages/MedicineRecommendation";
import DoctorRecommendation from "./pages/DoctorRecommendation";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// =====================================================
// COMPONENTS
// =====================================================

import PageTransition from "./components/PageTransition";


// =====================================================
// ANIMATED ROUTES
// =====================================================

function AnimatedRoutes() {

    const location = useLocation();

    return (

        <AnimatePresence mode="wait">

            <Routes
                location={location}
                key={location.pathname}
            >

                {/* =================================================
                    LANDING PAGE
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <LandingPage />
                    }
                />


                {/* =================================================
                    AUTHENTICATION
                ================================================= */}

                <Route
                    path="/login"
                    element={
                        <PageTransition>
                            <Login />
                        </PageTransition>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PageTransition>
                            <Register />
                        </PageTransition>
                    }
                />


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={
                        <Dashboard />
                    }
                />


                {/* =================================================
                    DISEASE PREDICTION
                ================================================= */}
                <Route
                    path="/symptoms"
                    element={<Symptoms />}
                />

                <Route
                    path="/symptom-prediction"
                    element={
                        <SymptomPrediction />
                    }
                />


                {/* =================================================
                    MEDICAL REPORT ANALYSIS
                ================================================= */}

                <Route
                    path="/report-analysis"
                    element={
                        <ReportAnalysis />
                    }
                />


                {/* =================================================
                    SKIN DISEASE
                ================================================= */}

                <Route
                    path="/skin-disease"
                    element={
                        <SkinDisease />
                    }
                />


                {/* =================================================
                    X-RAY ANALYSIS
                ================================================= */}

                <Route
                    path="/xray-analysis"
                    element={
                        <XrayAnalysis />
                    }
                />


                {/* =================================================
                    AI CHATBOT
                ================================================= */}

                <Route
                    path="/chatbot"
                    element={
                        <Chatbot />
                    }
                />


                {/* =================================================
                    MEDICINE RECOMMENDATION
                ================================================= */}

                <Route
                    path="/medicine"
                    element={
                        <MedicineRecommendation />
                    }
                />


                {/* =================================================
                    DOCTOR RECOMMENDATION
                ================================================= */}

                <Route
                    path="/doctor"
                    element={
                        <DoctorRecommendation />
                    }
                />


                {/* =================================================
                    USER PROFILE
                ================================================= */}

                <Route
                    path="/profile"
                    element={
                        <Profile />
                    }
                />


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <Route
                    path="/settings"
                    element={
                        <Settings />
                    }
                />


                {/* =================================================
                    404
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <NotFound />
                    }
                />

            </Routes>

        </AnimatePresence>

    );
}


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <AnimatedRoutes />

        </BrowserRouter>

    );
}


export default App;