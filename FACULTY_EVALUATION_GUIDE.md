# 🎓 Evaluator & Faculty Guide: Meiveli-NGEM Machine Learning Project

**Project Title:** Meiveli-NGEM — Autonomous Machine Learning Threat & Phishing Detection System  
**Institution:** B. S. Abdur Rahman Crescent Institute of Science and Technology  
**Department:** B.Tech Electronics and Communication Engineering (ECE) / E & CE — 5th Semester  
**Course Code:** ESDX 041  

### 👥 Project Team:
| Student Name | Register / Roll Number |
| :--- | :--- |
| **Mohammed Razik K** | `240201601062` |
| **Adhithiyan RRN** | `240201601006` |
| **Gautham Balaji** | `240201601022` |

---

## 📌 Executive Summary for Faculty Review

Dear Professor / Evaluator,

Thank you for reviewing our Machine Learning project! 

This project implements an **autonomous, 100% self-contained Machine Learning Threat Intelligence System** designed to detect cyber extortion, SMS smishing, and malicious phishing domains in real time.

### 🌟 Key Academic & Technical Highlights:
1. **Zero External API / Zero Cloud LLM Dependency:** Unlike basic wrappers that query external APIs (e.g., Google Gemini or OpenAI), our system features its own **client-side ML inference engine** (`src/utils/mlEngine.js`) and a dedicated **Python feature engineering & training pipeline** (`train_model.py`).
2. **Hybrid Machine Learning Architecture:** Combines **Multinomial Naive Bayes (MNB)** with Laplace Additive Smoothing ($\alpha = 1.0$) for token likelihood estimation and a **Calibrated Logistic Regression & Softmax layer** for structural URL and urgency features.
3. **Advanced Feature Engineering:**
   - **Urgency & Psychological Coercion Detector:** Analyzes deadline panic, legal extortion, and power disconnection threats.
   - **Credential Harvesting Extractor:** Identifies UPI PIN, OTP, and malicious APK download attempts.
   - **Shannon Domain Entropy ($H(D) = -\sum p_i \log_2 p_i$):** Flags algorithmically generated disposable phishing domains (DGA).
   - **Multi-Level Indian TLD Normalization:** Handles complex extensions (`.gov.in`, `.co.in`, `.tn.gov.in`) and detects brand mismatches.
4. **Statistical Evaluation:** Evaluated using **Stratified 5-Fold Cross-Validation** achieving **86.11% Accuracy** and **86.33% F1-Score**.
5. **Interactive ML Model Lab (`/ml-lab`):** A dedicated interface allowing evaluators to inspect live softmax probabilities, view confusion matrices, and test real-time continuous learning.

---

## 💻 Quick Setup: Running on Your PC (3 Steps)

### Step 1: Check Prerequisites
Ensure your PC has **Node.js** (v18 or higher) and **Python** (v3.10 or higher) installed:
- Open Terminal (macOS/Linux) or PowerShell / Command Prompt (Windows) and verify:
```bash
node -v
python --version
```
*(If Node.js is not installed, it can be downloaded in 1 minute from [nodejs.org](https://nodejs.org). If Python is needed for retraining, get it from [python.org](https://python.org)).*

---

### Step 2: Install Project Dependencies (One Command)
In your terminal, navigate to the project directory and run:
```bash
npm install
```
*(This installs Vite, React, and required UI dependencies in under 60 seconds).*

---

### Step 3: Start the Application
Run the local development server:
```bash
npm run dev
```
You will see output similar to:
```
  VITE v8.3.2  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
👉 **Open your browser and visit:** **`http://localhost:5173`**

---

## 📱 How to View the App on Your PC

MEYVIZHI is engineered as a **mobile-first citizen defense platform**. Here is how to test both the PC and Mobile views:

### Option A: PC View (Desktop Gateway & Analyst Dashboard)
- When opened directly on a desktop browser at `http://localhost:5173`:
  - You will see the **Desktop Gateway** displaying the project credentials, institution details, and navigation options.
  - Click **"Access Analyst Dashboard"** to view real-time threat maps, incident intelligence, and campaign graphs.
  - Click **"🔬 Launch ML Model Lab & Inspector"** to open the assignment evaluation laboratory.

### Option B: Mobile Citizen View (Recommended for Testing Scans)
Because the citizen reporting flow is optimized for smartphones, you can view it directly on your PC browser using Chrome / Edge Developer Tools:
1. Open `http://localhost:5173` in **Google Chrome** or **Microsoft Edge**.
2. Press **`F12`** (or right-click anywhere and select **Inspect**).
3. Click the **Toggle Device Toolbar** icon (or press **`Ctrl + Shift + M`** on Windows, **`Cmd + Shift + M`** on Mac).
4. Select a phone model (e.g. **iPhone 14**, **Pixel 7**, or **Samsung Galaxy S20**).
5. Refresh the page (`F5`). You will now see the citizen safety app layout!

---

## 🔬 Testing the Machine Learning Model

We have prepared two easy ways for you to evaluate the Machine Learning capabilities:

### Method 1: Interactive In-Browser ML Lab (`/ml-lab`)
Navigate to `http://localhost:5173/ml-lab` in your browser. Here you can test:

1. **Live Inspector:**
   - Click any pre-configured sample button (e.g. *⚡ TNEB Power Cut Scam*, *🏦 SBI KYC Phishing*, or *✅ Legitimate Bank Alert*).
   - Click **"⚡ Run Machine Learning Classifier"**.
   - Observe the live output:
     - **Calculated Threat Risk Score (0–100%)**
     - **Softmax Probabilities:** $P(\text{Scam})$, $P(\text{Suspicious})$, $P(\text{Safe})$
     - **Engineered Feature Vectors:** Urgency score, Credential risk score, and Shannon Domain Entropy in bits/char.
     - **Explainable AI (XAI) Signals:** Detailed flags explaining the exact evidence behind the prediction.

2. **Model Metrics & Math Tab:**
   - View the **Stratified 5-Fold Cross-Validation Metrics**: Accuracy (86.11%), Precision (87.45%), Recall (86.11%), F1-Score (86.33%).
   - Inspect the **$3 \times 3$ Confusion Matrix** table.
   - Review the mathematical formulations for Bayes' theorem, Laplace smoothing, and Shannon entropy.

3. **Interactive Trainer Tab:**
   - Enter a new sample message, select a label (`Safe`, `Suspicious`, `Scam`), and click **"+ Add Sample & Retrain"** to observe continuous learning in real time.

---

### Method 2: Command-Line Automated Verification Test (5 Seconds)
In your terminal, run our automated verification suite:
```bash
node test_ml_engine.js
```
**Expected Output:**
```
==================================================
🧪 TESTING MEIVELI ML THREAT ENGINE
==================================================

Test: TNEB Power Cut Extortion
Result: Verdict = SCAM (Score: 90%) -> ✅ PASS

Test: SBI KYC Phishing with Brand Mismatch
Result: Verdict = SCAM (Score: 90%) -> ✅ PASS

Test: PhonePe UPI PIN Theft
Result: Verdict = SCAM (Score: 90%) -> ✅ PASS

Test: Shortened Link (Obfuscated)
Result: Verdict = SUSPICIOUS (Score: 48%) -> ✅ PASS

Test: Legitimate SBI Transaction Alert
Result: Verdict = SAFE (Score: 5%) -> ✅ PASS

Test: Legitimate TANGEDCO Receipt
Result: Verdict = SAFE (Score: 5%) -> ✅ PASS

==================================================
Summary: 6/6 tests passed (100%)
==================================================
```

---

### Method 3: Running the Python Training Pipeline
To inspect or retrain the underlying machine learning model from scratch:
```bash
# 1. Install standard ML packages if not already present
pip install scikit-learn numpy scipy

# 2. Run the training pipeline
python train_model.py
```
**Output Highlights:**
- Loads 72 curated training samples from `ml_dataset/dataset.json`.
- Extracts N-gram TF-IDF and dense heuristic feature vectors.
- Runs Stratified 5-Fold Cross-Validation.
- Exports the serialized weights, priors, and vocabulary likelihoods directly to `src/data/trained_model.json`.

---

## 📝 Sample Test Cases for Evaluation

You can paste any of these messages into the **Citizen Scanner** (`/`) or **ML Lab** (`/ml-lab`) to test model responses:

### 🔴 High-Risk Scam Samples (Expected: `SCAM`)
1. **TNEB Power Cut Coercion:**
   > *"Dear customer, your TNEB power connection will be disconnected tonight at 9:30 PM due to unpaid electricity bill. Contact officer immediately at 9845123456."*
2. **SBI NetBanking Phishing:**
   > *"URGENT: Your SBI account has been suspended due to incomplete KYC. Click http://sbi-kyc-verify-update.xyz to update your PAN immediately to avoid permanent deactivation."*
3. **UPI Scratch Card Reward Scam:**
   > *"Congratulations! You have won ₹50,000 cash prize in PhonePe scratch card. Scan this QR code and enter your UPI PIN to claim money now: http://phonepe-rewards.club/claim"*
4. **CBI Digital Arrest Extortion:**
   > *"CBI & Cyber Crime Department: Your Aadhaar is found involved in 24 money laundering transactions and drugs courier. You are placed under digital arrest. Call Skype officer immediately."*

### 🟡 Suspicious Samples (Expected: `SUSPICIOUS`)
1. **Obfuscated Link:**
   > *"Check this new website out: http://bit.ly/3x8kQ9m for latest discount offers."*
2. **Direct IP Link:**
   > *"Your delivery package update: please review tracking information at http://192.168.1.105/track"*

### 🟢 Benign Institutional Samples (Expected: `SAFE`)
1. **Official Bank Transaction Alert:**
   > *"Dear SBI customer, your A/C 9876 has been credited with ₹25,000 on 23-Nov-26 by NEFT. Available balance: ₹48,200. SBI never asks for your confidential OTP."*
2. **Official TANGEDCO Electricity Receipt:**
   > *"TANGEDCO: Payment of ₹680 received for Consumer No 04-201-002-123 on 23-Nov-26. Receipt generated at official portal https://www.tangedco.gov.in. Thank you."*

---

## 📂 Project Architecture Reference

```
├── ml_dataset/
│   └── dataset.json              # 72 curated multi-class cyber threat training samples
├── src/
│   ├── data/
│   │   └── trained_model.json    # Serialized ML model artifact (weights, priors, vocab)
│   ├── pages/
│   │   ├── AnalystDashboard.jsx  # Desktop command center & threat monitor
│   │   ├── DesktopGateway.jsx    # Desktop entry gateway with faculty & project credentials
│   │   ├── HomePage.jsx          # Mobile citizen home & scanner
│   │   ├── MlLabPage.jsx         # Interactive ML Model Inspector & Lab (/ml-lab)
│   │   ├── ResultPage.jsx        # Detailed threat diagnosis & XAI breakdown
│   │   └── ReportPage.jsx        # Citizen reporting flow with ML auto-tagging
│   ├── utils/
│   │   ├── mlEngine.js           # Client-side Machine Learning inference engine
│   │   ├── domainAnalyzer.js     # URL parsing, TLD handling, & brand mismatch
│   │   └── analyze.js            # Unified ML entrypoint
├── test_ml_engine.js             # Automated verification test suite
├── train_model.py                # Python feature engineering & training pipeline
├── package.json                  # Dependencies & scripts
└── README.md                     # Comprehensive technical documentation & viva guide
```

---

## 🤝 Need Assistance During Evaluation?

If you encounter any issues while reviewing or running this project, our team is available to assist:
- **Mohammed Razik K:** `240201601062`
- **Adhithiyan RRN:** `240201601006`
- **Gautham Balaji:** `240201601022`

Thank you for your valuable feedback and evaluation!
