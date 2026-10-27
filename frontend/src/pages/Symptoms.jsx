import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Check, Loader2 } from "lucide-react";
import { predictDisease } from "../services/predictionService";
import "../styles/symptoms.css";

const symptomsList = [
    "itching",
    "skin_rash",
    "nodal_skin_eruptions",
    "continuous_sneezing",
    "shivering",
    "chills",
    "joint_pain",
    "stomach_pain",
    "acidity",
    "ulcers_on_tongue",
    "muscle_wasting",
    "vomiting",
    "burning_micturition",
    "spotting_ urination",
    "fatigue",
    "weight_gain",
    "anxiety",
    "cold_hands_and_feets",
    "mood_swings",
    "weight_loss",
    "restlessness",
    "lethargy",
    "patches_in_throat",
    "irregular_sugar_level",
    "cough",
    "high_fever",
    "sunken_eyes",
    "breathlessness",
    "sweating",
    "dehydration",
    "indigestion",
    "headache",
    "yellowish_skin",
    "dark_urine",
    "nausea",
    "loss_of_appetite",
    "pain_behind_the_eyes",
    "back_pain",
    "constipation",
    "abdominal_pain",
    "diarrhoea",
    "mild_fever",
    "yellow_urine",
    "yellowing_of_eyes",
    "acute_liver_failure",
    "fluid_overload",
    "swelling_of_stomach",
    "swelled_lymph_nodes",
    "malaise",
    "blurred_and_distorted_vision",
    "phlegm",
    "throat_irritation",
    "redness_of_eyes",
    "sinus_pressure",
    "runny_nose",
    "congestion",
    "chest_pain",
    "weakness_in_limbs",
    "fast_heart_rate",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "neck_pain",
    "dizziness",
    "cramps",
    "bruising",
    "obesity",
    "swollen_legs",
    "swollen_blood_vessels",
    "puffy_face_and_eyes",
    "enlarged_thyroid",
    "brittle_nails",
    "swollen_extremities",
    "excessive_hunger",
    "extra_marital_contacts",
    "drying_and_tingling_lips",
    "slurred_speech",
    "knee_pain",
    "hip_joint_pain",
    "muscle_weakness",
    "stiff_neck",
    "swelling_joints",
    "movement_stiffness",
    "spinning_movements",
    "loss_of_balance",
    "unsteadiness",
    "weakness_of_one_body_side",
    "loss_of_smell",
    "bladder_discomfort",
    "foul_smell_of urine",
    "continuous_feel_of_urine",
    "passage_of_gases",
    "internal_itching",
    "toxic_look_(typhos)",
    "depression",
    "irritability",
    "muscle_pain",
    "altered_sensorium",
    "red_spots_over_body",
    "belly_pain",
    "abnormal_menstruation",
    "dischromic _patches",
    "watering_from_eyes",
    "increased_appetite",
    "polyuria",
    "family_history",
    "mucoid_sputum",
    "rusty_sputum",
    "lack_of_concentration",
    "visual_disturbances",
    "receiving_blood_transfusion",
    "receiving_unsterile_injections",
    "coma",
    "stomach_bleeding",
    "distention_of_abdomen",
    "history_of_alcohol_consumption",
    "fluid_overload",
    "blood_in_sputum",
    "prominent_veins_on_calf",
    "palpitations",
    "painful_walking",
    "pus_filled_pimples",
    "blackheads",
    "scurring",
    "skin_peeling",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "blister",
    "red_sore_around_nose",
    "yellow_crust_ooze"
];

const formatSymptom = (symptom) =>
    symptom
        .replaceAll("_", " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());

export default function Symptoms() {

    const navigate = useNavigate();

    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const toggleSymptom = (symptom) => {

        setSelectedSymptoms((current) => {

            if (current.includes(symptom)) {
                return current.filter(
                    (item) => item !== symptom
                );
            }

            return [...current, symptom];
        });

        setError("");
    };

    const handlePrediction = async () => {

        if (selectedSymptoms.length === 0) {
            setError("Please select at least one symptom.");
            return;
        }

        setLoading(true);
        setError("");

        try {

            console.log(
                "Sending symptoms:",
                selectedSymptoms
            );

            const result =
                await predictDisease(selectedSymptoms);

            console.log(
                "Received prediction:",
                result
            );

            navigate(
                "/symptom-prediction",
                {
                    state: {
                        result: result,
                        symptoms: selectedSymptoms
                    }
                }
            );

        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                "Prediction failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    const filteredSymptoms =
        symptomsList.filter((symptom) =>
            symptom
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <div className="symptoms-page">

            <div className="symptoms-container">

                <div className="symptoms-header">

                    <h1>
                        Disease Prediction
                    </h1>

                    <p>
                        Select the symptoms you are experiencing
                    </p>

                </div>

                <div className="symptom-search">

                    <Search size={20} />

                    <input
                        type="text"
                        placeholder="Search symptoms..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <div className="selected-count">

                    Selected Symptoms:
                    {" "}
                    <strong>
                        {selectedSymptoms.length}
                    </strong>

                </div>

                {selectedSymptoms.length > 0 && (

                    <div className="selected-symptoms">

                        {selectedSymptoms.map((symptom) => (

                            <button
                                key={symptom}
                                onClick={() =>
                                    toggleSymptom(symptom)
                                }
                            >
                                {formatSymptom(symptom)}
                                {" ×"}
                            </button>

                        ))}

                    </div>

                )}

                <div className="symptoms-grid">

                    {filteredSymptoms.map((symptom) => {

                        const selected =
                            selectedSymptoms.includes(symptom);

                        return (
                            <button
                                key={symptom}
                                className={
                                    selected
                                        ? "symptom-card selected"
                                        : "symptom-card"
                                }
                                onClick={() =>
                                    toggleSymptom(symptom)
                                }
                            >

                                {selected && (
                                    <Check size={16} />
                                )}

                                {formatSymptom(symptom)}

                            </button>
                        );
                    })}

                </div>

                {error && (

                    <div className="prediction-error">
                        {error}
                    </div>

                )}

                <button
                    className="predict-button"
                    onClick={handlePrediction}
                    disabled={loading}
                >

                    {loading ? (
                        <>
                            <Loader2
                                size={20}
                                className="spin"
                            />

                            Predicting...
                        </>
                    ) : (
                        "Predict Disease"
                    )}

                </button>

            </div>

        </div>
    );
}