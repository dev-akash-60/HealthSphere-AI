# 🏥 HealthSphere AI

### An Intelligent AI-Powered Healthcare Assistant Platform

HealthSphere AI is an AI-powered healthcare platform designed to bring multiple healthcare assistance tools together in one place. It aims to help users explore potential health conditions, analyze medical information, and interact with an intelligent healthcare assistant through a modern, user-friendly interface.

The project combines machine learning, medical image analysis, and web technologies to explore how artificial intelligence can support digital healthcare.

## ✨ Features

* **🔐 User Authentication:** Registration and login interface for accessing the platform.
* **🩺 Symptom-Based Disease Prediction:** Predicts possible diseases from user-provided symptoms using a machine learning model.
* **📊 Personal Dashboard:** Provides a centralized interface for accessing healthcare modules and viewing dashboard summaries.
* **🩻 X-Ray Analysis:** Supports X-ray image uploads and AI-assisted bone fracture analysis.
* **📄 Medical Report Analysis:** A module for exploring and understanding medical report information.
* **🧴 Skin Disease Detection:** An interface for image-based skin condition analysis.
* **🤖 AI Healthcare Assistant:** A chatbot interface for health-related questions.
* **💊 Medicine AI:** A dedicated module for medicine-related information and recommendations.

*Feature availability may vary as the project is still under development.*

## 🛠️ Technology Stack

| Technology       | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| React.js         | Interactive frontend                             |
| Vite             | Frontend development and build tooling           |
| JavaScript       | Application logic                                |
| CSS              | Responsive styling and animations                |
| Framer Motion    | UI animations and transitions                    |
| Lucide React     | Interface icons                                  |
| Python           | Machine learning and backend development         |
| Flask / FastAPI  | Backend API development, depending on the module |
| NumPy and Pandas | Data processing                                  |
| Scikit-learn     | Machine learning workflows                       |
| TensorFlow       | Deep learning experiments, where applicable      |

## 🏗️ Project Architecture

The platform follows a modular architecture in which the frontend provides the user interface and backend services handle prediction and analysis tasks.

```text
HealthSphere AI/
├── backend/
│   ├── App/
│   │   ├── Chatbot/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── models.py
│   │   │   ├── prompts.py
│   │   │   ├── routes.py
│   │   │   ├── service.py
│   │   │   └── utils.py
│   │   ├── models/
│   │   ├── Routes/
│   │   │   └── disease_prediction.py
│   │   ├── Services/
│   │   ├── utils/
│   │   │   ├── config.py
│   │   │   └── main.py
│   │   ├── XRay/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── service.py
│   │   └── __init__.py
│   ├── venv/
│   ├── .env
│   ├── main.py
│   └── requirements.txt
├── frontend/
|   ├── public/
|   ├── src/
|   │   ├── assets/
|   │   ├── components/
|   │   │   ├── AICore.jsx
|   │   │   ├── AICoreDashboard.jsx
|   │   │   ├── BackgroundAnimation.jsx
|   │   │   ├── DashboardNavbar.jsx
|   │   │   ├── FeatureCard.jsx
|   │   │   ├── PageTransition.jsx
|   │   │   ├── ProtectedRoute.jsx
|   │   │   └── TransitionOverlay.jsx
|   │   ├── context/
|   │   │   ├── AuthContext.jsx
|   │   │   └── ThemeContext.jsx
|   │   ├── firebase/
|   │   │   └── firebase.jsx
|   │   ├── layouts/
|   │   │   ├── DashboardLayout.jsx
|   │   │   └── MainLayout.jsx
|   │   ├── pages/
|   │   │   ├── Chatbot.jsx
|   │   │   ├── Dashboard.jsx
|   │   │   ├── DoctorRecommendation.jsx
|   │   │   ├── LandingPage.jsx
|   │   │   ├── Login.jsx
|   │   │   ├── MedicineRecommendation.jsx
|   │   │   ├── NotFound.jsx
|   │   │   ├── Profile.jsx
|   │   │   ├── Register.jsx
|   │   │   ├── ReportAnalysis.jsx
|   │   │   ├── Settings.jsx
|   │   │   ├── SkinDisease.jsx
|   │   │   ├── SymptomPrediction.jsx
|   │   │   ├── Symptoms.jsx
|   │   │   └── XrayAnalysis.jsx
|   │   ├── services/
|   │   │   ├── api.js
|   │   │   ├── authService.js
|   │   │   └── predictionService.js
|   │   ├── styles/
|   │   │   │   ├── auth.css
|   │   │   │   ├── chatbot.css
|   │   │   │   ├── dashboardHome.css
|   │   │   │   ├── global.css
|   │   │   │   ├── landing.css
|   │   │   │   ├── login.css
|   │   │   │   ├── responsive.css
|   │   │   │   ├── symptomPrediction.css
|   │   │   │   ├── symptoms.css
|   │   │   │   ├── transition.css
|   │   │   │   └── XrayAnalysis.css
|   │   ├── utils/
|   │   ├── App.jsx
|   │   ├── index.css
|   │   └── main.jsx
|   ├── .gitignore
|   ├── eslint.config.js
|   ├── index.html
|   ├── package-lock.json
|   ├── package.json
|   ├── README.md
└──-└── vite.config.js

```

*This is a suggested organizational layout. Adjust it to match the actual folders and files in your repository.*

## 🚀 Getting Started

### Prerequisites

Install the following tools before running the project:

* Node.js and npm
* Python 3.10 or a compatible version for your backend dependencies
* Git
* Visual Studio Code or another code editor

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd HealthSphere-AI
```


### 2. Set Up the Frontend

Navigate to your frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

### 3. Set Up the Backend

Open another terminal and navigate to your backend directory:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the backend using the entry point configured in your project. For example, if the application uses Flask:

```bash
python app.py
```

For FastAPI, if your entry point is `app.py` and it exports an `app` object:

```bash
uvicorn app:app --reload
```

Use the command appropriate to your actual backend implementation.

## 🔬 Machine Learning Workflow

The machine learning components may follow this general workflow:

1. Collect and prepare relevant datasets.
2. Clean the data and preprocess the input features.
3. Train and evaluate the relevant model.
4. Save the trained model and any required preprocessing objects.
5. Connect the model to a backend API.
6. Send user input or uploaded images from the frontend to the backend.
7. Return and display the model's prediction or analysis.

Different modules may use different models and preprocessing pipelines.

## 🔮 Future Enhancements

* Improve model performance through dataset expansion and validation.
* Extend medical image analysis capabilities.
* Enhance medical report interpretation.
* Improve personalized health dashboards.
* Integrate additional healthcare recommendation tools.
* Improve accessibility and responsive design.
* Add stronger input validation, security, and error handling.
* Deploy the frontend and backend for public demonstration.

## ⚠️ Medical Disclaimer

HealthSphere AI is an educational and development project. Its predictions and outputs are intended for informational and experimental purposes only. They are not a substitute for professional medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional for medical concerns. Do not use this project alone to make medical decisions or delay seeking professional care.

## 👨‍💻 Project Team

* **Akash Ghosh**
* **Swagato De**

B.Tech, Computer Science and Engineering
Artificial Intelligence and Machine Learning
Brainware University

## 📄 License

No license has been specified yet. If you intend to make this project open source, consider adding an appropriate license file to the repository.

---

**HealthSphere AI**
*Exploring the future of intelligent digital healthcare.*
