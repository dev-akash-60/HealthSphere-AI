
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

import {
    Upload,
    X,
    ScanLine,
    FileImage,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    LoaderPinwheel,
    BoneFracture,
    ScanEye,
    Activity,
    Bone,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Info,
} from "lucide-react";

import "../styles/XrayAnalysis.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const normalizeLabel = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

const FRACTURE_POSITIVE_LABELS = [
    "fractured",
    "fracture",
    "fracture_detected",
    "fracture_present",
    "positive",
];

const FRACTURE_NEGATIVE_LABELS = [
    "not_fractured",
    "non_fractured",
    "no_fracture",
    "no_fractures",
    "no_fracture_detected",
    "not_fracture",
    "healthy",
    "normal",
    "negative",
    "no",
];

const XRAY_POSITIVE_LABELS = [
    "xray",
    "x_ray",
    "is_xray",
    "is_x_ray",
    "valid_xray",
    "valid_x_ray",
    "positive",
    "yes",
];

const XRAY_NEGATIVE_LABELS = [
    "not_xray",
    "non_xray",
    "not_x_ray",
    "non_x_ray",
    "invalid_xray",
    "invalid_x_ray",
    "negative",
    "no",
];

const parseFracturePrediction = (value) => {
    const label = normalizeLabel(value);

    // Check negative labels first.
    // "not_fractured" must never become a positive result.
    if (FRACTURE_NEGATIVE_LABELS.includes(label)) {
        return false;
    }

    if (FRACTURE_POSITIVE_LABELS.includes(label)) {
        return true;
    }

    return null;
};

const parseXrayPrediction = (value) => {
    const label = normalizeLabel(value);

    if (XRAY_NEGATIVE_LABELS.includes(label)) {
        return false;
    }

    if (XRAY_POSITIVE_LABELS.includes(label)) {
        return true;
    }

    return null;
};

// Supports confidence values in either decimal or percentage format.
const getPercentage = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return null;
    }

    return Math.min(
        100,
        Math.max(0, number > 1 ? number : number * 100)
    );
};

const formatConfidence = (value) => {
    const percentage = getPercentage(value);

    return percentage === null
        ? "Not available"
        : `${percentage.toFixed(2)}%`;
};

// Normalize the two-model backend response.
const normalizeResult = (data) => {
    const response = data?.result ?? data;

    if (!response || typeof response !== "object") {
        return null;
    }

    // MODEL 1: X-ray classification.
    let isXray = null;

    if (typeof response.is_xray === "boolean") {
        isXray = response.is_xray;
    } else if (typeof response.is_xray === "string") {
        isXray = parseXrayPrediction(response.is_xray);
    }

    if (isXray === null) {
        const xrayLabel =
            response.xray_prediction ??
            response.xray_class ??
            response.xray_status;

        isXray = parseXrayPrediction(xrayLabel);
    }

    // MODEL 2: Fracture classification.
    const fractureLabel =
        response.fracture_prediction ??
        response.fracture_class ??
        response.prediction;

    const isFractured = parseFracturePrediction(fractureLabel);

    return {
        raw: response,
        isXray,
        isFractured,
        xrayConfidence:
            response.xray_confidence ??
            response.xray_probability ??
            response.xray_score ??
            null,
        fractureConfidence:
            response.fracture_confidence ??
            response.fracture_probability ??
            response.fracture_score ??
            null,
        fractureLabel,
    };
};

const XrayAnalysis = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const previewUrlRef = useRef(null);

    // Release the previous image preview URL.
    const clearPreviewUrl = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
    };

    // Validate and select an image.
    const selectFile = (selectedFile) => {
        if (!selectedFile) return;

        const isValidType =
            ALLOWED_TYPES.includes(selectedFile.type) ||
            /\.(jpe?g|png|webp)$/i.test(selectedFile.name);

        if (!isValidType) {
            setError("Please upload a JPG, JPEG, PNG, or WEBP image.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("Image size must be less than 10 MB.");
            return;
        }

        if (selectedFile.size === 0) {
            setError("The selected image is empty.");
            return;
        }

        clearPreviewUrl();

        const imageUrl = URL.createObjectURL(selectedFile);

        previewUrlRef.current = imageUrl;

        setFile(selectedFile);
        setPreview(imageUrl);
        setResult(null);
        setError("");
    };

    // File input handler.
    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        selectFile(selectedFile);

        event.target.value = "";
    };

    // Drag and drop handlers.
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!loading) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(false);

        if (loading) return;

        const droppedFile = event.dataTransfer.files?.[0];

        if (droppedFile) {
            selectFile(droppedFile);
        }
    };

    // Remove selected image.
    const handleRemove = () => {
        if (loading) return;

        clearPreviewUrl();

        setFile(null);
        setPreview(null);
        setResult(null);
        setError("");
        setIsDragging(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Analyze uploaded X-ray using both backend models.
    const handleAnalyze = async () => {
        if (!file) {
            setError("Please upload an X-ray image first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post(
                "/api/xray/predict",
                formData,
                {
                    timeout: 180000,
                }
            );

            const normalized = normalizeResult(response.data);

            if (!normalized) {
                throw new Error(
                    "The backend returned an invalid response."
                );
            }

            setResult(normalized);
        } catch (err) {
            console.error("X-ray analysis error:", err);

            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while analyzing the X-ray.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to analyze this image. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Start a fresh analysis without removing the image.
    const handleAnalyzeAgain = () => {
        setResult(null);
        setError("");
    };

    // Release preview URL when component unmounts.
    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    return (
        <div className="xray-page">

           

            {/* PAGE HEADER */}
            <div className="xray-header">
                <div className="xray-header-icon">
                    <Bone size={28} />
                </div>

                <div>
                    <span className="xray-header-label">
                        AI HEALTHCARE ANALYSIS
                    </span>

                    <h1>X-Ray Analysis</h1>

                    <p>
                        Two-stage AI analysis for X-ray validation
                        and bone fracture detection.
                    </p>
                </div>
            </div>

            <div className="xray-content">

                {/* UPLOAD SECTION */}
                <div className="xray-card upload-card">

                    <div className="section-heading">
                        <div className="section-icon">
                            <ScanLine size={20} />
                        </div>

                        <div>
                            <h2>Upload X-Ray Image</h2>

                            <p>
                                Upload an image to begin the two-stage
                                AI analysis.
                            </p>
                        </div>
                    </div>

                    {!preview ? (
                        <div
                            className={`upload-box ${isDragging ? "drag-active" : ""
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            role="button"
                            tabIndex={0}
                            aria-label="Upload an X-ray image"
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                hidden
                            />

                            <div className="upload-icon">
                                <Upload size={34} />
                            </div>

                            <h3>
                                {isDragging
                                    ? "Drop your image here"
                                    : "Drag and drop your X-ray image"}
                            </h3>

                            <p>
                                Or click here to browse files
                            </p>

                            <span className="upload-formats">
                                JPG, JPEG, PNG, WEBP
                            </span>

                            <span className="upload-size">
                                Maximum file size: 10 MB
                            </span>

                            <span className="browse-btn">
                                <Upload size={17} />
                                Browse Image
                            </span>
                        </div>
                    ) : (
                        <div className="preview-section">

                            <div className="preview-header">
                                <div className="preview-file-info">
                                    <FileImage size={20} />

                                    <div>
                                        <h3>{file?.name}</h3>

                                        <p>
                                            {(
                                                file.size /
                                                (1024 * 1024)
                                            ).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="remove-file-btn"
                                    onClick={handleRemove}
                                    disabled={loading}
                                    aria-label="Remove image"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            {/* IMAGE PREVIEW */}
                            <div className="preview-container">
                                <img
                                    src={preview}
                                    alt="Uploaded medical image preview"
                                />

                                {/* SCANNING ANIMATION */}
                                {loading && (
                                    <div className="scan-overlay">
                                        <div className="scan-grid"></div>

                                        <div className="scan-line"></div>

                                        <div className="scan-horizontal-glow"></div>

                                        <div className="scan-corner top-left"></div>
                                        <div className="scan-corner top-right"></div>
                                        <div className="scan-corner bottom-left"></div>
                                        <div className="scan-corner bottom-right"></div>

                                        <div className="scan-status">
                                            <Activity
                                                size={16}
                                                className="scan-pulse"
                                            />

                                            RUNNING AI MODELS
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TWO MODEL PROCESS */}
                            <div className="model-process">
                                <div className="process-step">
                                    <div className="process-number">01</div>

                                    <div>
                                        <strong>X-Ray Classification</strong>
                                        <span>
                                            Verify whether the image is an X-ray
                                        </span>
                                    </div>
                                </div>

                                <div className="process-connector"></div>

                                <div className="process-step">
                                    <div className="process-number">02</div>

                                    <div>
                                        <strong>Fracture Detection</strong>
                                        <span>
                                            Check for possible bone fractures
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!result && (
                                <button
                                    type="button"
                                    className="analyze-btn"
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <ScanEye
                                                size={19}
                                                className="loading-spinner"
                                            />
                                            Analyzing Image...
                                        </>
                                    ) : (
                                        <>
                                            <ScanLine size={19} />
                                            Analyze X-Ray
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <div className="xray-error">
                            <AlertTriangle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* RESULTS */}
                {result && (
                    <div className="xray-card result-card">

                        <div className="section-heading">
                            <div className="section-icon">
                                <Activity size={20} />
                            </div>

                            <div>
                                <h2>Analysis Results</h2>

                                <p>
                                    Results from your two-stage AI system.
                                </p>
                            </div>
                        </div>

                        {/* MODEL 1: XRAY CLASSIFICATION */}
                        <div className="model-result-block">
                            <div className="model-result-heading">
                                <span className="model-step-label">
                                    MODEL 01
                                </span>

                                <h3>X-Ray Classification</h3>

                                <p>
                                    Determines whether the uploaded image
                                    is a valid X-ray.
                                </p>
                            </div>

                            {result.isXray === true ? (
                                <div className="stage-status success-status">
                                    <CheckCircle2 size={21} />

                                    <div>
                                        <strong>X-Ray Image Detected</strong> <br />
                                        <span>
                                            The first model classified
                                            the uploaded image as an X-ray.
                                        </span>
                                    </div>
                                </div>
                            ) : result.isXray === false ? (
                                <div className="stage-status danger-status">
                                    <XCircle size={21} />

                                    <div>
                                        <strong>Not an X-Ray Image</strong> <br />
                                        <span>
                                            The first model did not recognize
                                            this image as an X-ray.
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="stage-status warning-status">
                                    <Info size={21} />

                                    <div>
                                        <strong>Classification Unavailable</strong>
                                        <span>
                                            The backend did not return a
                                            recognizable X-ray classification.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {result.xrayConfidence !== null && (
                                <div className="confidence-item">
                                    <div className="confidence-heading">
                                        <span>X-Ray Confidence</span>

                                        <strong>
                                            {formatConfidence(
                                                result.xrayConfidence
                                            )}
                                        </strong>
                                    </div>

                                    <div className="confidence-track">
                                        <div
                                            className="confidence-fill xray-fill"
                                            style={{
                                                width: `${getPercentage(
                                                    result.xrayConfidence
                                                ) ?? 0
                                                    }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MODEL 2: FRACTURE CLASSIFICATION */}
                        {result.isXray === true && (
                            <div className="model-result-block fracture-model-block">
                                <div className="model-result-heading">
                                    <span className="model-step-label">
                                        MODEL 02
                                    </span>

                                    <h3>Bone Fracture Detection</h3>

                                    <p>
                                        Checks the X-ray image for possible
                                        fracture patterns.
                                    </p>
                                </div>

                                {result.isFractured === true ? (
                                    <div className="result-message fracture-result">
                                        <div className="result-icon fracture">
                                            <AlertTriangle size={30} />
                                        </div>

                                        <div>
                                            <span className="result-label">
                                                PREDICTION
                                            </span>

                                            <h3>
                                                Possible Fracture Detected
                                            </h3>

                                            <p>
                                                The second model detected
                                                patterns that may indicate
                                                a bone fracture.
                                            </p>
                                        </div>
                                    </div>
                                ) : result.isFractured === false ? (
                                    <div className="result-message healthy-result">
                                        <div className="result-icon healthy">
                                            <ShieldCheck size={30} />
                                        </div>

                                        <div>
                                            <span className="result-label">
                                                PREDICTION
                                            </span>

                                            <h3>No Fracture Detected</h3>

                                            <p>
                                                The second model did not detect
                                                patterns indicating a fracture.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="stage-status warning-status">
                                        <Info size={21} />

                                        <div>
                                            <strong>
                                                Fracture Prediction Unavailable
                                            </strong>

                                            <span>
                                                The backend did not return a
                                                recognizable fracture label.
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {result.fractureConfidence !== null && (
                                    <div className="confidence-item">
                                        <div className="confidence-heading">
                                            <span>
                                                Fracture Confidence
                                            </span>

                                            <strong>
                                                {formatConfidence(
                                                    result.fractureConfidence
                                                )}
                                            </strong>
                                        </div>

                                        <div className="confidence-track">
                                            <div
                                                className={`confidence-fill ${result.isFractured === true
                                                        ? "fracture-fill"
                                                        : "healthy-fill"
                                                    }`}
                                                style={{
                                                    width: `${getPercentage(
                                                        result.fractureConfidence
                                                    ) ?? 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* INVALID IMAGE MESSAGE */}
                        {result.isXray === false && (
                            <div className="invalid-xray-notice">
                                <AlertTriangle size={19} />

                                <p>
                                    The fracture detection model was not
                                    used because the first model rejected
                                    this image as an X-ray.
                                </p>
                            </div>
                        )}

                        {result.isXray === null && (
                            <div className="invalid-xray-notice">
                                <Info size={19} />

                                <p>
                                    The X-ray classification result is
                                    missing or unrecognized. The fracture
                                    result cannot be safely interpreted.
                                </p>
                            </div>
                        )}

                        {/* DISCLAIMER */}
                        <div className="xray-disclaimer">
                            <ShieldCheck size={18} />

                            <p>
                                <strong>Medical Disclaimer:</strong>{" "}
                                This AI-generated result is for educational
                                and informational purposes only. It is not
                                a medical diagnosis. Always consult a
                                qualified healthcare professional or
                                radiologist.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="analyze-again-btn"
                            onClick={handleAnalyzeAgain}
                        >
                            <RefreshCw size={18} />
                            Analyze Image Again
                        </button>
                    </div>
                )}

                {/* INFORMATION CARDS */}
                <div className="xray-info-grid">

                    <div className="info-card">
                        <div className="info-icon">
                            <Upload size={22} />
                        </div>

                        <h3>Upload Image</h3>

                        <p>
                            Upload a supported medical image from your device.
                        </p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <ScanLine size={22} />
                        </div>

                        <h3>X-Ray Verification</h3>

                        <p>
                            Model 1 checks whether the uploaded image
                            is an X-ray.
                        </p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <Activity size={22} />
                        </div>

                        <h3>Fracture Detection</h3>

                        <p>
                            Model 2 checks the verified X-ray for
                            possible bone fractures.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XrayAnalysis;
