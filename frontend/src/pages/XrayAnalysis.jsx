
import React, { useState } from "react";
import axios from "axios";
import {
    Upload,
    X,
    ScanLine,
    FileImage,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    Activity,
    Bone
} from "lucide-react";

import "../styles/XrayAnalysis.css";
const API_URL = import.meta.env.VITE_API_URL;


const XrayAnalysis = () => {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // FILE SELECT
    // =====================================================

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);

        setPreview(
            URL.createObjectURL(selectedFile)
        );

        setResult(null);
        setError("");
    };


    // =====================================================
    // REMOVE FILE
    // =====================================================

    const handleRemove = () => {

        setFile(null);
        setPreview(null);
        setResult(null);
        setError("");

    };


    // =====================================================
    // ANALYZE X-RAY
    // =====================================================

    const handleAnalyze = async () => {

        if (!file) {

            setError(
                "Please upload an image first."
            );

            return;
        }


        setLoading(true);
        setError("");
        setResult(null);


        try {

            const formData = new FormData();

            formData.append(
                "file",
                file
            );


            const response = await axios.post(
                `${API_URL}/api/xray/predict`,
                formData,
                {
                    timeout: 120000,
                }
            );


            setResult(
                response.data
            );


        } catch (err) {

            console.error(
                "X-Ray analysis error:",
                err
            );


            setError(
                err.response?.data?.detail ||
                "Failed to analyze the image."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // ANALYZE AGAIN
    // =====================================================

    const handleAnalyzeAgain = () => {

        setResult(null);
        setError("");

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="xray-page">

            {/* =================================================
                BACKGROUND GLOW
            ================================================= */}

            <div className="xray-glow glow-one"></div>

            <div className="xray-glow glow-two"></div>


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="xray-header">

                <div className="header-icon">

                    <ScanLine
                        size={32}
                    />

                </div>


                <div>

                    <div className="header-label">

                        <Activity
                            size={13}
                        />

                        AI X-RAY ANALYSIS

                    </div>


                    <h1>
                        X-Ray Analysis
                    </h1>


                    <p>
                        AI-powered X-ray validation and
                        fracture detection.
                    </p>

                </div>

            </div>


            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="xray-main-card">


                {/* =================================================
                    NO FILE / UPLOAD
                ================================================= */}

                {!preview && !result && (

                    <div className="upload-section">

                        <label
                            className="upload-box"
                        >

                            <div className="upload-icon">

                                <Upload
                                    size={38}
                                />

                            </div>


                            <h2>
                                Upload an X-Ray
                            </h2>


                            <p>
                                Upload a medical X-ray image
                                for AI-powered analysis and
                                fracture detection.
                            </p>


                            <span className="upload-formats">
                                JPG, JPEG, PNG or WEBP
                            </span>


                            <span className="browse-btn">

                                <Upload
                                    size={18}
                                />

                                Browse Image

                            </span>


                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleFileChange}
                                hidden
                            />

                        </label>

                    </div>

                )}


                {/* =================================================
                    IMAGE PREVIEW
                ================================================= */}

                {preview && !result && (

                    <div className="preview-section">

                        <div className="preview-header">

                            <div>

                                <span>
                                    SELECTED IMAGE
                                </span>

                                <h3>
                                    X-Ray Preview
                                </h3>

                            </div>


                            <button
                                className="remove-btn"
                                onClick={handleRemove}
                                type="button"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>


                        </div>


                        <div className="preview-container">

                            <img
                                src={preview}
                                alt="Uploaded X-ray"
                            />


                            {loading && (

                                <div className="scan-overlay">

                                    <div className="scan-line"></div>

                                </div>

                            )}

                        </div>


                        <div className="file-info">

                            <FileImage
                                size={22}
                            />

                            <div>

                                <strong>
                                    {file?.name}
                                </strong>

                                <span>
                                    {(
                                        file.size / 1024
                                    ).toFixed(1)} KB
                                </span>

                            </div>

                        </div>


                        <button
                            className="analyze-btn"
                            onClick={handleAnalyze}
                            disabled={loading}
                            type="button"
                        >

                            {loading ? (

                                <>
                                    <Loader2
                                        size={20}
                                        className="spin"
                                    />

                                    Analyzing Image...

                                </>

                            ) : (

                                <>
                                    <ScanLine
                                        size={20}
                                    />

                                    Analyze X-Ray

                                </>
                            )}

                        </button>


                        {error && (

                            <div className="xray-error">

                                <AlertTriangle
                                    size={20}
                                />

                                {error}

                            </div>

                        )}

                    </div>

                )}


                {/* =================================================
                    RESULT
                ================================================= */}

                {result && (

                    <div className="result-section">


                        {/* =================================================
                            NOT X-RAY
                        ================================================= */}

                        {!result.is_xray ? (

                            <>

                                <div className="result-icon fracture">

                                    <AlertTriangle
                                        size={45}
                                    />

                                </div>


                                <span className="result-label">
                                    IMAGE VALIDATION
                                </span>


                                <h2>
                                    Not an X-Ray
                                </h2>


                                <p className="result-description">

                                    {result.message ||
                                        "The uploaded image does not appear to be an X-ray image."
                                    }

                                </p>


                                {result.xray_probability !== undefined && (

                                    <div className="confidence-card">

                                        <div className="confidence-top">

                                            <span>
                                                X-Ray Confidence
                                            </span>

                                            <strong>
                                                {(
                                                    result.xray_probability * 100
                                                ).toFixed(2)}
                                                %
                                            </strong>

                                        </div>


                                        <div className="confidence-bar">

                                            <div
                                                className="confidence-fill"
                                                style={{
                                                    width:
                                                        `${ result.xray_probability * 100 }% `
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                )}


                                <button
                                    className="analyze-again-btn"
                                    onClick={handleRemove}
                                    type="button"
                                >

                                    <Upload
                                        size={19}
                                    />

                                    Upload Another Image

                                </button>

                            </>

                        ) : (

                            /* =================================================
                               X-RAY DETECTED
                            ================================================= */

                            <>

                                <div
                                    className={
                                        `result - icon ${
    result.prediction === "fractured"
        ? "fracture"
        : "healthy"
} `
                                    }
                                >

                                    {result.prediction === "fractured" ? (

                                        <Bone
                                            size={48}
                                        />

                                    ) : (

                                        <ShieldCheck
                                            size={48}
                                        />

                                    )}

                                </div>


                                <span className="result-label">
                                    AI ANALYSIS COMPLETE
                                </span>


                                <h2>
                                    {result.prediction === "fractured"
                                        ? "Fracture Detected"
                                        : "No Fracture Detected"
                                    }
                                </h2>


                                <p className="result-description">

                                    {result.message ||
                                        "X-ray image analyzed successfully."
                                    }

                                </p>


                                {/* X-RAY CONFIDENCE */}

                                {result.xray_probability !== undefined && (

                                    <div className="confidence-card">

                                        <div className="confidence-top">

                                            <span>
                                                X-Ray Confidence
                                            </span>

                                            <strong>
                                                {(
                                                    result.xray_probability * 100
                                                ).toFixed(2)}
                                                %
                                            </strong>

                                        </div>


                                        <div className="confidence-bar">

                                            <div
                                                className="confidence-fill"
                                                style={{
                                                    width:
                                                        `${ result.xray_probability * 100 }% `
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                )}


                                {/* FRACTURE CONFIDENCE */}

                                {result.fracture_probability !== undefined && (

                                    <div className="confidence-card">

                                        <div className="confidence-top">

                                            <span>
                                                Fracture Confidence
                                            </span>

                                            <strong>
                                                {(
                                                    result.fracture_probability * 100
                                                ).toFixed(2)}
                                                %
                                            </strong>

                                        </div>


                                        <div className="confidence-bar">

                                            <div
                                                className={
                                                    result.prediction === "fractured"
                                                        ? "confidence-fill fracture-fill"
                                                        : "confidence-fill"
                                                }
                                                style={{
                                                    width:
                                                        `${ result.fracture_probability * 100 }% `
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                )}


                                {/* FILE NAME */}

                                <div className="result-file">

                                    <FileImage
                                        size={16}
                                    />

                                    {file?.name}

                                </div>


                                {/* DISCLAIMER */}

                                <div className="medical-disclaimer">

                                    <AlertTriangle
                                        size={20}
                                    />

                                    <p>

                                        This AI analysis is intended
                                        for informational purposes only
                                        and should not replace professional
                                        medical diagnosis or consultation.

                                    </p>

                                </div>


                                {/* ANALYZE AGAIN */}

                                <button
                                    className="analyze-again-btn"
                                    onClick={handleRemove}
                                    type="button"
                                >

                                    <Upload
                                        size={19}
                                    />

                                    Analyze Another Image

                                </button>

                            </>

                        )}

                    </div>

                )}

            </div>


            {/* =================================================
                FEATURES
            ================================================= */}

            {!result && (

                <div className="xray-features">

                    <div className="feature">

                        <ScanLine
                            size={22}
                        />

                        <div>

                            <strong>
                                X-Ray Validation
                            </strong>

                            <span>
                                Filters non-X-ray images
                            </span>

                        </div>

                    </div>


                    <div className="feature">

                        <Bone
                            size={22}
                        />

                        <div>

                            <strong>
                                Fracture Detection
                            </strong>

                            <span>
                                AI-powered fracture analysis
                            </span>

                        </div>

                    </div>


                    <div className="feature">

                        <ShieldCheck
                            size={22}
                        />

                        <div>

                            <strong>
                                AI Assisted
                            </strong>

                            <span>
                                Fast automated analysis
                            </span>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default XrayAnalysis;
