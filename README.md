# 🛡️ MEIVELI-NGEM: Machine Learning Threat & Phishing Detection System

[![Machine Learning Engine](https://img.shields.io/badge/ML%20Engine-Self--Contained%20(Zero%20API)-success.svg)](#-machine-learning-architecture)
[![Model Accuracy](https://img.shields.io/badge/Model%20Accuracy-86.11%25-blue.svg)](#-model-evaluation--cross-validation-metrics)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel%20Ready-black.svg)](#-step-by-step-vercel-deployment-guide)
[![Framework](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb.svg)](#-project-directory-structure)

**Meiveli-NGEM** is a privacy-first, autonomous **Machine Learning Cyber Threat Intelligence Platform** engineered to detect SMS phishing (smishing), brand impersonation, urgent financial extortion, and malicious URLs in real time.

> [!TIP]
> 📖 **Faculty & Evaluator Guide:** A complete step-by-step evaluation guide for running, testing, and reviewing this project locally is available in [**FACULTY_EVALUATION_GUIDE.md**](FACULTY_EVALUATION_GUIDE.md).

---

## 📑 Table of Contents
1. [Project Transformation: From Gemini API to Autonomous ML](#-project-transformation-from-gemini-api-to-autonomous-ml)
2. [Machine Learning Architecture](#-machine-learning-architecture)
3. [Feature Engineering Pipeline](#-feature-engineering-pipeline)
4. [Mathematical Formulations](#-mathematical-formulations)
5. [Dataset & Threat Vectors](#-dataset--threat-vectors)
6. [Model Evaluation & Cross-Validation Metrics](#-model-evaluation--cross-validation-metrics)
7. [In-Browser ML Inference Engine (`src/utils/mlEngine.js`)](#-in-browser-ml-inference-engine)
8. [Interactive ML Model Lab & Inspector (`/ml-lab`)](#-interactive-ml-model-lab--inspector)
9. [Detailed Summary of Code Changes](#-detailed-summary-of-code-changes)
10. [Step-by-Step Vercel Deployment Guide](#-step-by-step-vercel-deployment-guide)
11. [20 Academic Viva & Defense Questions with Detailed Answers](#-20-academic-viva--defense-questions-with-detailed-answers)
12. [Project Directory Structure](#-project-directory-structure)

---

## 🔄 Project Transformation: From Gemini API to Autonomous ML

The previous version of this application relied on Google's Gemini Cloud API (`@google/generative-ai`), sending text and prompts across the internet to an external large language model. This setup presented major challenges for a production cyber defense tool and machine learning coursework:
- **API Key Barrier:** The app would fail to analyze messages if a user or evaluator did not supply a personal Gemini API key.
- **High Latency:** External network hops to Gemini servers introduced 1.5–3.5 second delays.
- **Privacy Leakage:** Citizen messages, OTPs, and private communications were transmitted to third-party cloud infrastructure.
- **Black-Box Decision Making:** Cloud LLMs lacked transparent feature weights, token likelihoods, and statistical confusion matrices.

### Comparison Table: Old vs. New Architecture

| Dimension | Legacy Gemini API System | New Autonomous ML Engine |
| :--- | :--- | :--- |
| **Inference Location** | External Google Cloud servers | **100% Client-Side In-Browser / Edge** |
| **External API Dependencies** | Requires Gemini API Key (`AIza...`) | **Zero (0) external API keys required** |
| **Inference Latency** | 1,500 ms – 3,500 ms | **< 1 millisecond** |
| **Offline Functionality** | Fails completely without internet | **Runs 100% offline or on flight mode** |
| **Explainability (XAI)** | Generative LLM hallucination risk | **Deterministic Feature Attribution (Urgency, Credentials, Entropy, Brand)** |
| **Deployment Simplicity** | Fragile (breaks if API quota runs out) | **Single-click deploy on Vercel without environment blockers** |
| **Academic ML Rigor** | API wrapper (not an ML project) | **Feature engineering, TF-IDF, Bayes theorem, entropy, cross-validation** |

---

## 🧠 Machine Learning Architecture

The system treats cyber extortion and phishing detection as a **calibrated multi-class classification problem** across three risk categories:
1. **`Safe` (Class 0):** Low risk, legitimate communications from verified institutions (e.g. verified banking transaction alerts from SBI/HDFC/ICICI, official TANGEDCO electricity receipts, genuine government advisories).
2. **`Suspicious` (Class 1):** Medium risk, unverified domains, shortened links (`bit.ly`, `tinyurl`), high entropy hostnames, or borderline urgency.
3. **`Scam` (Class 2):** Very high risk, confirmed brand impersonation, urgent threats of power cut/arrest, credential harvesting (UPI PIN/OTP), or malware `.apk` download links.

```
                           [ Citizen Input: Text / URL / SMS ]
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
 [ Text NLP Feature Extractor ]                             [ URL & Domain Structural Extractor ]
 ├── N-gram Tokenization (Unigrams + Bigrams)               ├── URL Clean & Punctuation Stripping
 ├── Urgency & Coercion Lexicon Scoring (0-100)             ├── Multi-Level Indian TLD Normalization
 ├── Credential Theft & ID Extraction (PIN/OTP/APK)         ├── Shannon Domain Entropy H(D)
 ├── Financial Bait & Escrow Trap Detection                 ├── High-Risk TLD Verification (.xyz, .top)
 └── Authority Impersonation Checks (CBI, Police, TNEB)     └── Brand Impersonation Mismatch vs Whitelist
         │                                                                   │
         └─────────────────────────────────┬─────────────────────────────────┘
                                           ▼
                    [ Calibrated Hybrid ML Classification Engine ]
                    ├── Bayesian Class Log-Likelihoods: log P(C | w)
                    ├── Calibrated Logistic Feature Weighting Layer
                    └── Softmax Normalization Layer
                                           │
                                           ▼
                    [ Multi-Vector Diagnostics & Explainable AI (XAI) ]
                    ├── Calibrated Threat Risk Score (0 - 100%)
                    ├── Softmax Probabilities: P(Scam), P(Suspicious), P(Safe)
                    ├── Keyword Attributions & Signal Flags
                    └── Instant Sync to Supabase Real-time Threat Heatmap
```

---

## 🔬 Feature Engineering Pipeline

### 1. Natural Language Processing (NLP) Representation
The input string is cleaned using regular expressions to strip special noise characters while preserving currency markers (`₹`, `rs.`). The cleaned text is tokenized into:
- **Unigrams:** Individual vocabulary words (e.g., `suspended`, `power`, `otp`).
- **Bigrams:** Consecutive word pairs capturing contextual threat phrases (e.g., `digital_arrest`, `upi_pin`, `account_suspended`, `power_cut`, `tonight_9_30`).

### 2. Domain-Specific Threat Lexicons
The engine scans for specific psychological levers used by cybercriminals:
- **Urgency & Coercion Lexicon (`analyzeUrgency`):**
  - Immediate action verbs: `immediately`, `urgent`, `urgently`, `at once`, `action required`.
  - Strict deadlines: `tonight`, `within 24 hours`, `before 8 PM`, `expires today`.
  - Service cutoff threats: `disconnect`, `power cut`, `suspended`, `deactivated`, `blocked`.
  - Legal extortion: `digital arrest`, `court warrant`, `cbi`, `police`, `fir`, `penalty`.
- **Credential Harvesting Lexicon (`analyzeCredentials`):**
  - Direct PIN/Password requests: `upi pin`, `mpin`, `cvv`, `password`.
  - OTP theft: `otp`, `one time password`, `share otp`.
  - Identity hijacking: `pan card`, `aadhaar`, `update kyc`, `link aadhaar`.
  - Malware vectors: `.apk`, `download app`, `anydesk`, `teamviewer`, `quicksupport`, `rustdesk`.
- **Financial Bait Lexicon (`analyzeFinancialTriggers`):**
  - Prize triggers: `lottery`, `won ₹50,000`, `scratch card`, `cashback`, `lucky draw`.
  - Escrow fraud: `processing fee`, `bail money`, `transfer to safe account`.

### 3. URL Lexical & Structural Engineering
- **Sentence Punctuation Stripping:** URLs pasted within sentences frequently contain trailing periods, commas, or parentheses (e.g. `...portal https://tangedco.gov.in. Thank you.`). The engine automatically strips trailing delimiters before analysis.
- **Multi-Level TLD Normalization:** Handles complex two-level TLDs common in India and globally (`.co.in`, `.gov.in`, `.org.in`, `.tn.gov.in`, `.nic.in`, `.co.uk`) ensuring `parivahan.gov.in` extracts the registered root `parivahan.gov.in` instead of simply `gov.in`.
- **Shannon Domain Entropy Calculation:** Evaluates character randomness to flag disposable phishing domains generated by DGA (Domain Generation Algorithms).
- **Brand Mismatch Detection:** If the message text references recognized entities (SBI, LIC, TNEB, Amazon, Parivahan) but the URL's registered domain does not match their official root domain, `brandMismatch = true` is asserted.

---

## 📐 Mathematical Formulations

### 1. Bayesian Text Likelihood with Laplace Smoothing
For an input token sequence $\mathbf{w} = (w_1, w_2, \dots, w_n)$ and target class $C_k \in \{\text{Safe}, \text{Suspicious}, \text{Scam}\}$:

$$\log P(C_k \mid \mathbf{w}) \propto \log P(C_k) + \sum_{i=1}^n \log \left( \frac{\text{count}(w_i, C_k) + \alpha}{N_{C_k} + \alpha |V|} \right)$$

Where:
- $\alpha = 1.0$ (Laplace additive smoothing parameter to prevent zero-probability errors on out-of-vocabulary words).
- $N_{C_k}$ is the total token frequency observed in class $C_k$.
- $|V|$ is the total unique vocabulary size ($|V| = 254$ tokens).
- $P(C_k)$ is the class prior probability estimated from sample distributions:
  $$P(C_k) = \frac{\text{count}(C_k) + 1}{N + K}$$

### 2. Shannon Domain Entropy (DGA & Obfuscation Detection)
Legitimate domains typically consist of structured dictionary words (e.g. `onlinesbi.sbi`). Scammers rely on disposable, randomized strings (e.g. `sbi-x8k-9q.xyz`). The **Shannon Entropy** $H(D)$ of the registered domain character string is computed as:

$$H(D) = -\sum_{i=1}^m p(x_i) \log_2 p(x_i)$$

Where:
- $m$ is the number of distinct characters in the domain string.
- $p(x_i) = \frac{\text{count}(x_i)}{|D|}$ is the empirical probability of character $x_i$ appearing in domain $D$.
- Domains with $H(D) > 3.8\text{ bits/char}$ exhibit high randomness and receive an elevated risk penalty.

### 3. Calibrated Softmax Threat Layer
The dense engineered feature vector $\mathbf{x}_{\text{dense}}$ (urgency score, credential score, domain entropy, brand mismatch, suspicious TLD) and token log-likelihoods are combined to yield the logit vector $\mathbf{z}$:

$$P(Y = C_k \mid \mathbf{x}) = \frac{\exp(z_k)}{\sum_{j=1}^3 \exp(z_j)}$$

### 4. Continuous Threat Risk Score Calibration
The final single-scalar **Threat Risk Score** $S \in [0, 100]\%$ is computed through calibrated expectation:

$$S = \text{round}\Big( 90 \cdot P(\text{Scam}) + 45 \cdot P(\text{Suspicious}) + 5 \cdot P(\text{Safe}) \Big)$$

---

## 📊 Dataset & Threat Vectors

The model training dataset (`ml_dataset/dataset.json`) contains **72 curated, labeled samples** capturing contemporary cyber threat vectors in India, alongside legitimate institutional communications.

```
Total Samples: 72
├── SCAM: 34 samples (47.2%)
├── SAFE: 22 samples (30.6%)
└── SUSPICIOUS: 16 samples (22.2%)
```

### Threat Categories Represented:
1. **Electricity Disconnection Scams (TNEB / TANGEDCO):** Threatens immediate power cut tonight at 9:30 PM for non-payment, urging calls to personal 10-digit mobile numbers.
2. **Bank KYC / PAN Suspension (SBI / HDFC / ICICI):** Phishing links disguised as official portals (`sbi-kyc-verify-update.xyz`) claiming accounts are deactivated.
3. **UPI Reward & Scratch Card Scams (PhonePe / GPay / Paytm):** Deceives users into entering their UPI PIN to "receive" cashback or lottery money.
4. **Digital Arrest & Extortion (CBI / Police / Customs):** Video call threats claiming the victim's Aadhaar is linked to illegal narcotics in courier parcels, demanding escrow transfers.
5. **Malicious APK Downloads (RAT Trojans):** Urges users to download Android APK files directly or install remote-control tools (AnyDesk, TeamViewer).
6. **Traffic e-Challan Scams (Parivahan spoofing):** Fake violation fines sent via SMS with lookalike URLs (`echallan-parivahan-pay.site`).
7. **Legitimate Institutional Baseline:** Legitimate banking transaction receipts, official OTPs with "Do not share" warnings, Swiggy/Amazon delivery notices, and verified government portals (`tangedco.gov.in`, `parivahan.gov.in`, `licindia.in`).

---

## 📈 Model Evaluation & Cross-Validation Metrics

The model was rigorously evaluated using **Stratified 5-Fold Cross-Validation** via `train_model.py`:

| Evaluation Metric | Cross-Validation Score |
| :--- | :--- |
| **Accuracy** | **86.11%** |
| **Weighted Precision** | **87.45%** |
| **Weighted Recall** | **86.11%** |
| **Weighted F1-Score** | **86.33%** |
| **Average Inference Time** | **< 1 ms (Client-Side JavaScript)** |
| **External API Calls** | **0 (Zero)** |

### 3x3 Confusion Matrix (5-Fold Stratified CV)

| Ground Truth \ Predicted | Predicted: SAFE | Predicted: SUSPICIOUS | Predicted: SCAM |
| :--- | :---: | :---: | :---: |
| **Actual: SAFE (22)** | **20** | 0 | 2 |
| **Actual: SUSPICIOUS (16)** | 2 | **14** | 0 |
| **Actual: SCAM (34)** | 5 | 1 | **28** |

- **Safe Accuracy:** 90.9% (20/22 correctly identified).
- **Suspicious Recall:** 87.5% (14/16 correctly flagged).
- **Scam Detection Recall:** 82.4% (28/34 correctly captured).

---

## 💻 In-Browser ML Inference Engine

Located at `src/utils/mlEngine.js`, the inference engine contains **zero external network requests**:
- **Imports Model Weights:** Loads `trained_model.json` synchronously at startup.
- **Vectorization:** Tokenizes incoming text and maps tokens against the trained vocabulary log-likelihoods.
- **Lexical Evaluators:** Runs regex-based urgency, credential, and monetary scoring pipelines.
- **Entropy & TLD Analyzer:** Extracts domains, calculates exact Shannon entropy, and flags blacklisted extensions.
- **Softmax Normalizer:** Combines feature weights into calibrated percentages.
- **Signal Generator:** Formulates human-readable evidence cards explaining the verdict.

---

## 🧪 Interactive ML Model Lab & Inspector

Meiveli includes a dedicated web interface at `/ml-lab` (`src/pages/MlLabPage.jsx`) designed specifically for assignment reviews, grading, and demonstration:

1. **Live Inspector Tab:**
   - Input custom text or click pre-configured threat buttons (TNEB Power Cut, SBI Phishing, PhonePe UPI PIN, Digital Arrest, Legitimate Alert).
   - View the calculated Risk Score gauge (0–100%).
   - Inspect individual class probabilities: $P(\text{Scam})$, $P(\text{Suspicious})$, $P(\text{Safe})$.
   - Examine real-time engineered feature vectors: Urgency Score, Credential Theft Score, Shannon Domain Entropy, and Brand Mismatch flags.
2. **Model Metrics & Math Tab:**
   - Full statistical evaluation dashboard: Accuracy, Weighted Precision, Recall, F1-Score.
   - Interactive $3 \times 3$ confusion matrix table.
   - Mathematical equations for Bayes' theorem, Laplace smoothing, and Shannon entropy.
3. **Interactive Retrainer Tab:**
   - Add new labeled SMS or phishing samples in real time.
   - Demonstrates continuous learning directly in the browser.

---

## 🛠️ Detailed Summary of Code Changes

Here is the exact record of everything modified and created:

1. **Created `ml_dataset/dataset.json`:**
   - 72 curated training samples across Indian cyber extortion and benign communication patterns.
2. **Created `train_model.py`:**
   - Python machine learning pipeline using scikit-learn, numpy, and scipy.
   - Computes TF-IDF, dense features, runs 5-fold cross validation, and exports `src/data/trained_model.json`.
3. **Created `src/data/trained_model.json`:**
   - Self-contained model artifact storing prior probabilities, word log likelihoods, feature coefficients, and cross-validation metrics.
4. **Created `src/utils/mlEngine.js`:**
   - Pure client-side ML classification engine. Computes Shannon entropy, tokenization, urgency scoring, credential scoring, and softmax output.
5. **Updated `src/utils/analyze.js`:**
   - Completely replaced Google Generative AI imports with `classifyThreatWithML`.
   - Exported `analyzeWithML` and aliased `analyzeWithGemini` for seamless backward compatibility.
6. **Fixed `src/utils/domainAnalyzer.js`:**
   - Fixed regex trailing sentence punctuation bug (`.`, `,`, `!`) so URLs embedded in sentences parse clean hostnames.
7. **Created `src/pages/MlLabPage.jsx`:**
   - Comprehensive 3-tab assignment evaluation interface (`/ml-lab`).
8. **Updated `src/pages/ResultPage.jsx`:**
   - Replaced Gemini API error messages with an expandable **"Machine Learning Explanations"** panel showing live softmax confidence bars and feature vectors.
9. **Updated `src/pages/ReportPage.jsx`:**
   - Replaced basic boolean checks with `classifyThreatWithML` to auto-tag reports accurately as `Scam`, `Suspicious`, or `Safe`.
10. **Updated `src/components/SettingsModal.jsx`:**
    - Replaced the Gemini API key input field with the **ML Threat Engine Control Panel**, displaying active status, model specs, and sensitivity presets.
11. **Updated `src/pages/DesktopGateway.jsx`:**
    - Added direct launch buttons for the ML Model Lab, Citizen Web Preview, and Analyst Dashboard.
12. **Updated `src/pages/MobileLoginPage.jsx`:**
    - Added a *"Continue as Guest / Evaluator"* button so anyone can review the app without needing Google OAuth credentials configured.
13. **Updated `src/App.jsx`:**
    - Added the `/ml-lab` route and guest session management.
14. **Created `test_ml_engine.js`:**
    - Standalone Node.js verification script verifying 100% pass on benchmark threat test cases.
15. **Cleaned `package.json`:**
    - Removed `@google/generative-ai` dependency to keep the build lightweight.
16. **Updated `README.md`:**
    - Comprehensive technical documentation and viva defense guide.

---

## 🚀 Step-by-Step Vercel Deployment Guide

Because the application is 100% self-contained and has zero external backend or API key blockers, deploying to Vercel takes under 2 minutes:

### 1. Push to GitHub
```bash
git push -u origin main
```

### 2. Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository: `razzikk09-zikzik/ML-MEIVELI`.
4. Vercel will automatically detect the settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. *(Optional)* Add your Supabase environment variables if using live database sync:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **"Deploy"**.

Your application will be live at `https://your-project.vercel.app` with all ML features functioning out-of-the-box!

---

## 🎓 20 Academic Viva & Defense Questions with Detailed Answers

Below are 20 technical questions an examiner, professor, or project reviewer may ask during an assignment evaluation, along with complete answers:

### 1. What is the fundamental problem your Machine Learning model solves?
*Answer:* It solves the automated detection and risk classification of cyber extortion, SMS phishing, and malicious domains by evaluating natural language coercion cues alongside URL lexical and structural anomalies, categorizing threats into `Safe`, `Suspicious`, or `Scam`.

### 2. Why did you replace cloud LLMs (like Google Gemini) with a self-contained ML engine?
*Answer:* Cloud LLMs introduce external API latency (1.5–3.5s), require recurring subscription/token costs, fail when rate-limited or offline, and present privacy risks when sensitive OTPs/messages are transmitted to third-party servers. Our local engine executes in under 1 millisecond on the client device with complete privacy and zero API dependencies.

### 3. What machine learning algorithms are utilized in the pipeline?
*Answer:* A calibrated hybrid ensemble combining **Multinomial Naive Bayes (MNB)** with Laplace smoothing for text token log-likelihood estimation, and a **Calibrated Logistic Regression & Softmax layer** for dense engineered features (urgency, credential risks, Shannon entropy, brand mismatch).

### 4. What is Laplace smoothing, and why is it necessary in your Bayesian classifier?
*Answer:* Laplace smoothing adds a constant $\alpha = 1.0$ to the numerator and $\alpha \cdot |V|$ to the denominator when calculating word probabilities: $P(w_i \mid C) = \frac{\text{count}(w_i, C) + 1}{N_C + |V|}$. Without it, encountering a previously unseen token in a message would result in a zero probability, zeroing out the entire posterior calculation.

### 5. How do you measure domain randomness, and what is the formula?
*Answer:* We compute the **Shannon Entropy** of the registered domain string:
$$H(D) = -\sum_{i=1}^m p(x_i) \log_2 p(x_i)$$
Legitimate organizations use readable words (entropy $\approx 2.0 - 3.2$), whereas algorithmically generated phishing domains (DGA) display random character distributions with entropy values exceeding $3.8\text{ bits/char}$.

### 6. How does your model capture "Urgency" and psychological coercion?
*Answer:* Cybercriminals leverage artificial deadlines to induce panic. The `analyzeUrgency` module extracts temporal pressure patterns (e.g. `within 24 hours`, `tonight at 9:30 PM`), service disruption threats (`power cut`, `account suspended`), and legal extortion (`digital arrest`, `court warrant`), producing a normalized urgency score from 0 to 100.

### 7. How does the system detect Brand Impersonation?
*Answer:* The engine extracts named entities from the message text (e.g. "SBI", "TNEB", "Amazon") and cross-references them against the URL's true registered root domain. If a message claims to be from "State Bank of India" but the link resolves to `sbi-kyc-verify.xyz` instead of `sbi.co.in`, `brandMismatch: true` is triggered, escalating the threat risk score.

### 8. How do you handle complex two-level Indian Top-Level Domains (TLDs)?
*Answer:* Standard domain splitting by the last dot fails on two-level TLDs (e.g. parsing `parivahan.gov.in` as root `in` instead of `parivahan.gov.in`). Our `extractRegisteredDomain` function maintains a specific lookup for complex TLDs (`.gov.in`, `.co.in`, `.org.in`, `.tn.gov.in`) to extract the exact registered domain.

### 9. Why are URL shorteners penalized in the classifier?
*Answer:* Shorteners like `bit.ly` and `tinyurl.com` obfuscate the true destination hostname to bypass keyword filters. In cybersecurity intelligence, an unexpanded shortener in an unsolicited message presents inherent risk and is weighted as `Suspicious` until validated.

### 10. How does the model output continuous probability scores?
*Answer:* The logit values from the Bayesian likelihoods and logistic feature weights are passed through a Softmax normalization function:
$$P(Y = C_k \mid \mathbf{x}) = \frac{\exp(z_k)}{\sum_j \exp(z_j)}$$
yielding a probability distribution across `Safe`, `Suspicious`, and `Scam` summing to 1.0 (100%).

### 11. What is the difference between Precision and Recall in this project, and which is prioritized?
*Answer:* Precision measures the proportion of flagged scams that are genuinely scams. Recall measures the proportion of actual scams correctly flagged. In cybersecurity, we prioritize **Recall on Scams**; failing to warn a user about a real scam (False Negative) results in financial loss, whereas flagging a safe message for review (False Positive) is merely a minor inconvenience.

### 12. What cross-validation technique was used, and what were the results?
*Answer:* We utilized **Stratified 5-Fold Cross-Validation**, ensuring each fold maintained the exact class proportions of the overall dataset. The model achieved **86.11% Accuracy**, **87.45% Precision**, and **86.33% F1-Score**.

### 13. How does the system handle Class Imbalance during training?
*Answer:* In `train_model.py`, we apply `class_weight='balanced'` in the Logistic Regression layer. This assigns penalty weights inversely proportional to class frequencies, preventing the majority scam class from overwhelming the minority suspicious or safe classes.

### 14. What is the role of `trained_model.json`?
*Answer:* It serves as the model serialization artifact. Instead of requiring a running Python/Flask/FastAPI server, the weights, vocabulary log-likelihoods, priors, and heuristic coefficients are serialized to JSON and loaded directly into JavaScript memory for zero-latency in-browser execution.

### 15. How does the interactive retraining feature in the ML Lab work?
*Answer:* In `src/pages/MlLabPage.jsx`, users can input new text and ground-truth labels. The frontend dynamically updates the token frequencies and Bayesian likelihood tables in application state, allowing examiners to observe predictions adapting in real time.

### 16. What happens if a user submits a valid URL with trailing punctuation (e.g., at the end of a sentence)?
*Answer:* Our URL extraction regex strips trailing delimiters (`.`, `,`, `!`, `?`, `)`, `]`). Without this preprocessing, a legitimate domain like `https://tangedco.gov.in.` would fail hostname matching and trigger false positive brand mismatch alerts.

### 17. What are the key features in your dense feature vector?
*Answer:* The dense vector includes 10 features: Urgency Count, Credential Trigger Count, Financial Bait Count, Authority Entity Count, Has URL Flag, Total URL Count, Suspicious TLD Flag, Shortener Flag, Raw IP Address Flag, and Shannon Domain Entropy.

### 18. Why is an APK download link treated as an extreme threat?
*Answer:* Legitimate banks and government entities distribute apps through the official Google Play Store or Apple App Store. Direct `.apk` download prompts in SMS are the primary delivery vector for Remote Access Trojans (RATs) and SMS-forwarding malware.

### 19. How does the system scale when deployed to thousands of concurrent users?
*Answer:* Because the Machine Learning inference is executed client-side in the user's browser, server load is $O(1)$. Vercel serves static pre-compiled JavaScript chunks via edge CDNs, allowing millions of simultaneous classifications without backend server bottlenecks.

### 20. What is Explainable AI (XAI), and how does your app implement it?
*Answer:* Explainable AI ensures that machine learning decisions can be audited and understood by humans. Instead of returning a raw percentage, Meiveli generates structured evidence signals indicating the specific triggers that influenced the verdict (e.g. "High Urgency Pressure Detected (75/100)", "Brand Impersonation Detected", "Domain Shannon Entropy: 3.92 bits/char").

---

## 📁 Project Directory Structure

```
├── ml_dataset/
│   └── dataset.json              # Curated multi-class cyber threat training dataset (72 samples)
├── src/
│   ├── components/               # UI components (ThreatMap, TopBar, BottomTabBar, SettingsModal)
│   ├── context/                  # React Context (LanguageContext - English/Tamil)
│   ├── data/
│   │   ├── trained_model.json    # Exported trained ML model artifact (weights, priors, vocab)
│   │   └── mock.js               # Mock UI templates
│   ├── hooks/                    # useHotspots (Supabase realtime data hook)
│   ├── pages/
│   │   ├── AnalystDashboard.jsx  # Desktop command center & threat monitor
│   │   ├── DesktopGateway.jsx    # Responsive desktop entry point
│   │   ├── HomePage.jsx          # Mobile citizen home & scanner
│   │   ├── MlLabPage.jsx         # Interactive ML Model Inspector & Lab (/ml-lab)
│   │   ├── MobileLoginPage.jsx   # Mobile login & Guest Evaluator bypass
│   │   ├── ReportPage.jsx        # Citizen reporting flow with ML auto-tagging
│   │   └── ResultPage.jsx        # Detailed threat diagnosis & XAI breakdown
│   ├── utils/
│   │   ├── analyze.js            # ML entrypoint (replaces legacy Gemini API)
│   │   ├── domainAnalyzer.js     # URL parsing, TLD handling, & brand mismatch
│   │   ├── mlEngine.js           # Client-side Machine Learning inference engine
│   │   ├── trustedDomains.js     # Whitelist vault of official domains
│   │   └── supabase.js           # Database client
│   ├── App.jsx                   # Main application router
│   └── main.jsx                  # React DOM entrypoint
├── test_ml_engine.js             # Automated verification suite for the ML engine
├── train_model.py                # Python feature engineering & training pipeline
├── vercel.json                   # Vercel deployment configuration
└── package.json                  # Dependencies & scripts
```
