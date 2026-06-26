# 🚀 PlacementWatch

**An AI-powered Full-Stack Placement Analytics & Prediction Platform**

PlacementWatch is a comprehensive web application that enables students to explore placement statistics, contribute placement experiences, and leverage Machine Learning models to predict expected salary packages (CTC) and the top recruiting companies based on their academic profile.

The application integrates a modern web stack with Machine Learning, providing real-time predictions, authentication, automated model retraining, and cloud deployment.

---

## 🌐 Live Demo

**Frontend:** `https://your-vercel-url.vercel.app`

**Backend API:** `https://your-railway-url.up.railway.app`

---

# ✨ Features

### 📊 Placement Dashboard

* View overall placement statistics
* Company-wise average CTC visualization
* Highest & Average CTC
* Total companies and placement records
* Interactive charts using Chart.js

---

### 👤 User Authentication

* Secure JWT Authentication
* Email OTP Verification
* Forgot Password via Email OTP
* Password Reset
* Protected Routes
* User-specific placement history

---

### 📝 Placement Management

* Submit new placement records
* Edit/Delete own submissions
* Company-specific placement browsing
* Placement details page
* Comment system

---

### 🤖 AI Powered Prediction

#### 💰 CTC Predictor

Predicts the expected placement package using:

* CGPA
* Department
* Difficulty Rating
* Role
* Graduation Year

Machine Learning Model:

* Random Forest Regressor
* **R² Score:** **0.82**
* **Mean Absolute Error (MAE):** **6.29 LPA**

---

#### 🏢 Company Predictor

Predicts the **Top 5 Most Probable Recruiting Companies** along with confidence scores using:

* CGPA
* Department

Machine Learning Model:

* Random Forest Classifier

---

### 🔄 Automated AI Retraining

Admin users can retrain both Machine Learning models with a single click.

The retraining pipeline automatically:

* Exports latest MongoDB data
* Generates updated CSV dataset
* Retrains Regression Model
* Retrains Classification Model
* Saves updated `.pkl` models

No manual intervention required.

---

# 🏗️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Chart.js

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib

## Authentication

* JWT
* bcrypt.js
* Nodemailer
* OTP Verification

## Deployment

* Vercel (Frontend)
* Railway (Backend)

---

# 📂 Project Structure

```
PlacementWatch/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── predict.html
│   ├── script.js
│   └── style.css
│
├── backend/
│   ├── AI/
│   │   ├── predict_ctc.py
│   │   ├── predict_company.py
│   │   ├── train_ctc.py
│   │   ├── train.py
│   │   ├── export_csv.py
│   │   ├── ctc_predictor.pkl
│   │   ├── company_predictor.pkl
│   │   └── requirements.txt
│   │
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
└── README.md
```

---

# 🧠 Machine Learning Pipeline

```
Placement Records
        │
        ▼
 MongoDB Atlas
        │
        ▼
 CSV Export
        │
        ▼
 Data Preprocessing
        │
        ▼
 Random Forest Models
        │
        ▼
 Saved .pkl Models
        │
        ▼
 Node.js API
        │
        ▼
 Live AI Predictions
```

---

# 🚀 Local Installation

### Clone Repository

```bash
git clone https://github.com/Mayukh-71/PlacementWatch.git
```

```bash
cd PlacementWatch
```

---

### Backend

```bash
cd backend
npm install
```

Install Python dependencies:

```bash
pip install -r AI/requirements.txt
```

Run the backend:

```bash
npm start
```

---

### Frontend

Open the `frontend` folder using **Live Server** or any static web server.

---

# 📈 Future Improvements

* Resume-based Placement Prediction
* Placement Trend Forecasting
* Interview Experience Recommendation
* Company Recommendation Engine
* Student Performance Analytics
* Admin Dashboard Analytics
* Role Recommendation System
* Email Notifications
* Placement Heatmaps

---

# 📸 Screenshots

Add screenshots here after deployment.

Example:

```
Home Page

Dashboard

AI Predictor

Placement Submission

Company Statistics
```

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Mayukh Paul**

B.Tech, Chemical Engineering
Indian Institute of Technology Kharagpur

GitHub: https://github.com/Mayukh-71
