import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Brain,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";

import "../styles/symptomPrediction.css";

const formatText = (text) => {

    if (!text) return "";

    return String(text)
        .replaceAll("_", " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function SymptomPrediction() {

    const location = useLocation();

    const navigate = useNavigate();

    const result = location.state?.result;

    const symptoms =
        location.state?.symptoms || [];


    console.log(
        "Prediction page result:",
        result
    );


    if (!result) {

        return (
            <div className="prediction-page">

                <div className="prediction-empty">

                    <AlertTriangle size={45} />

                    <h2>
                        No Prediction Available
                    </h2>

                    <p>
                        No prediction data was received.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/symptoms")
                        }
                    >
                        <ArrowLeft size={18} />

                        Select Symptoms
                    </button>

                </div>

            </div>
        );
    }


    /*
     * Support different backend field names.
     */

    const disease =
        result.disease ||
        result.prediction ||
        result.predicted_disease ||
        result.prognosis ||
        "Unknown";


    const predictions =
        result.top_predictions ||
        result.predictions ||
        [];


    return (

        <div className="prediction-page">

            <div className="prediction-container">


                {/* HEADER */}

                <div className="prediction-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/symptoms")
                        }
                    >

                        <ArrowLeft size={20} />

                        Back

                    </button>


                    <div className="prediction-title">

                        <div className="prediction-icon">

                            <Brain size={30} />

                        </div>

                        <div>

                            <h1>
                                HealthSphere AI
                            </h1>

                            <p>
                                Disease Prediction
                            </p>

                        </div>

                    </div>

                </div>


                {/* RESULT */}

                <div className="main-result-card">

                    <CheckCircle2
                        size={48}
                        className="result-icon"
                    />

                    <p className="result-label">
                        Predicted Disease
                    </p>

                    <h2>
                        {formatText(disease)}
                    </h2>

                </div>


                {/* TOP PREDICTIONS */}

                {predictions.length > 0 && (

                    <div className="predictions-card">

                        <div className="card-heading">

                            <Brain size={22} />

                            <h2>
                                Possible Conditions
                            </h2>

                        </div>


                        {predictions.map(
                            (item, index) => {

                                const name =
                                    item.disease ||
                                    item.prediction ||
                                    item.label ||
                                    "Unknown";

                                const probability =
                                    Number(
                                        item.probability ??
                                        item.confidence ??
                                        0
                                    );


                                return (

                                    <div
                                        className="prediction-row"
                                        key={index}
                                    >

                                        <div className="prediction-name">

                                            <span className="rank">
                                                #{index + 1}
                                            </span>

                                            <span>
                                                {formatText(name)}
                                            </span>

                                        </div>


                                        <div className="probability-container">

                                            <div className="probability-bar">

                                                <div
                                                    className="probability-fill"
                                                    style={{
                                                        width:
                                                            `${Math.min(
                                                                100,
                                                                probability
                                                            )}%`
                                                    }}
                                                />

                                            </div>

                                            <strong>
                                                {probability.toFixed(2)}%
                                            </strong>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}


                {/* SELECTED SYMPTOMS */}

                <div className="symptoms-card">

                    <div className="card-heading">

                        <CheckCircle2 size={22} />

                        <h2>
                            Symptoms Analyzed
                        </h2>

                    </div>


                    <div className="symptoms-list">

                        {symptoms.map((symptom) => (

                            <span
                                className="symptom-tag"
                                key={symptom}
                            >
                                {formatText(symptom)}
                            </span>

                        ))}

                    </div>

                </div>


                {/* DISCLAIMER */}

                <div className="medical-disclaimer">

                    <AlertTriangle size={20} />

                    <div>

                        <strong>
                            Medical Disclaimer
                        </strong>

                        <p>
                            This AI prediction is for
                            informational purposes only.
                            It is not a medical diagnosis
                            and should not replace advice
                            from a qualified healthcare
                            professional.
                        </p>

                    </div>

                </div>


                <button
                    className="new-prediction-button"
                    onClick={() =>
                        navigate("/symptoms")
                    }
                >
                    New Prediction
                </button>

            </div>

        </div>
    );
}