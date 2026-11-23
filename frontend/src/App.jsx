
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import {
    AnimatePresence
} from "framer-motion";

// PAGES
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

// COMPONENTS
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";


function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
                <Routes location={location}>
                    {/* PUBLIC ROUTES */}

                    <Route
                        path="/"
                        element={<LandingPage />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* PROTECTED ROUTES */}

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/symptoms"
                            element={<Symptoms />}
                        />

                        <Route
                            path="/symptom-prediction"
                            element={<SymptomPrediction />}
                        />

                        <Route
                            path="/report-analysis"
                            element={<ReportAnalysis />}
                        />

                        <Route
                            path="/skin-disease"
                            element={<SkinDisease />}
                        />

                        <Route
                            path="/xray-analysis"
                            element={<XrayAnalysis />}
                        />

                        <Route
                            path="/chatbot"
                            element={<Chatbot />}
                        />

                        <Route
                            path="/medicine"
                            element={<MedicineRecommendation />}
                        />

                        <Route
                            path="/doctor"
                            element={<DoctorRecommendation />}
                        />

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/settings"
                            element={<Settings />}
                        />
                    </Route>

                    {/* 404 */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </PageTransition>
        </AnimatePresence>
    );
}


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
