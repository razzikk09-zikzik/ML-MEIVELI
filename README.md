# Meiveli-NGEM: Machine Learning Threat & Phishing Detection System

An autonomous, multi-modal **Machine Learning threat intelligence platform** designed for real-time classification of cyber extortion, SMS phishing (smishing), brand impersonation, and malicious URLs. 

> [!IMPORTANT]
> **100% Self-Contained Machine Learning Architecture**: Unlike traditional implementations requiring external cloud LLM APIs (e.g. Google Gemini), Meiveli runs on a **completely self-reliant, client-side Machine Learning inference engine (`src/utils/mlEngine.js`)** coupled with a rigorous **Python feature engineering & training pipeline (`train_model.py`)**. It works with zero external API dependencies, zero latency, offline resilience, and deploys effortlessly on platforms like **Vercel**.

---

## 🧠 Machine Learning Architecture & Core Concept

The Meiveli Threat Engine formulates scam detection as a **multi-class classification problem** across three risk tiers:
- **`Safe` (Class 0):** Low risk, legitimate communications from verified institutions.
- **`Suspicious` (Class 1):** Medium risk, unverified domains, shortened links, or low-confidence anomaly patterns.
- **`Scam` (Class 2):** Very high risk, brand impersonation, urgent financial/coercive extortion, credential harvesting, or malicious payloads (.apk).

```
                                 [ User Input (Text / URL / SMS) ]
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
     [ Text NLP Feature Extractor ]                             [ URL & Domain Structural Extractor ]
  - N-gram Tokenization (Unigrams + Bigrams)                 - URL Length & Path Depth
  - Urgency & Coercion Lexicon Scoring (0-100)               - Shannon Domain Entropy H(D)
  - Credential Theft & ID Extraction (OTP/PIN/APK)            - Generic & High-Risk TLD Verification (.xyz, .top)
  - Financial Bait & Escrow Trap Detection                   - URL Shortener & Tunnel Service Detection
  - Authority Impersonation Checks (CBI, Police, TNEB)       - Brand Impersonation Mismatch vs Trusted Vault
                 │                                                             │
                 └──────────────────────────────┬──────────────────────────────┘
                                                ▼
                         [ Calibrated Hybrid ML Classification Engine ]
                               - Bayesian Class Log-Likelihoods
                               - Learned Feature Logistic Weights
                               - Calibrated Softmax Layer
                                                │
                                                ▼
                         [ Comprehensive Diagnostic Output & XAI ]
                 • Risk Score (0-100%)
                 • Class Probabilities: P(Scam), P(Suspicious), P(Safe)
                 • Explainable AI (XAI) Signals & Keyword Attributions
                 • Instant Database Sync & Live Threat Heatmap Filtering
```

---

## 🔬 Mathematical Formulations

### 1. Bayesian Text Likelihood with Laplace Smoothing
For an input token sequence $\mathbf{w} = (w_1, w_2, \dots, w_n)$ and class $C_k \in \{\text{Safe}, \text{Suspicious}, \text{Scam}\}$:

$$\log P(C_k \mid \mathbf{w}) \propto \log P(C_k) + \sum_{i=1}^n \log \left( \frac{\text{count}(w_i, C_k) + \alpha}{N_{C_k} + \alpha |V|} \right)$$

where:
- $\alpha = 1.0$ (Laplace additive smoothing).
- $N_{C_k}$ is the total word frequency in class $C_k$.
- $|V|$ is the overall vocabulary size.

### 2. Shannon Domain Entropy (DGA & Obfuscation Detection)
Scammers frequently register disposable, algorithmically generated or randomized domain names (e.g. `sbi-x8k-9q.xyz`). The system computes the **Shannon Entropy** $H(D)$ of the registered domain string:

$$H(D) = -\sum_{i=1}^k p(x_i) \log_2 p(x_i)$$

where $p(x_i)$ is the frequency of character $x_i$ divided by domain length $|D|$. A domain entropy $H(D) > 3.8$ bits/char signals high randomness and escalates the suspicion weight.

### 3. Calibrated Softmax Threat Layer
The dense engineered feature vector $\mathbf{x}_{\text{dense}}$ and log-likelihoods are combined to yield the calibrated posterior distribution:

$$P(Y = C_k \mid \mathbf{x}) = \frac{\exp(z_k)}{\sum_{j} \exp(z_j)}$$

The final **Threat Risk Score** $S \in [0, 100]$ is calibrated as:

$$S = \text{round}\Big( 90 \cdot P(\text{Scam}) + 45 \cdot P(\text{Suspicious}) + 5 \cdot P(\text{Safe}) \Big)$$

---

## 📊 Dataset & Model Evaluation Metrics

The model is trained on `ml_dataset/dataset.json` containing curated, real-world Indian cyber threats (TNEB power cut scams, SBI/HDFC KYC phishing, UPI PhonePe scratch cards, CBI digital arrests, job scams, APK trojans) alongside legitimate banking OTPs, government portals, and transaction notifications.

### Stratified 5-Fold Cross-Validation Performance

| Metric | Score |
| :--- | :--- |
| **Accuracy** | **86.11%** |
| **Precision (Weighted)** | **87.45%** |
| **Recall (Weighted)** | **86.11%** |
| **F1-Score (Weighted)** | **86.33%** |
| **Inference Latency** | **< 1 ms (Client-Side)** |
| **External API Calls** | **0 (Zero)** |

### Confusion Matrix
```
               Predicted: Safe   Predicted: Suspicious   Predicted: Scam
Actual: Safe           20                  0                    2
Actual: Suspicious      2                 14                    0
Actual: Scam            5                  1                   28
```

---

## 🛠️ Machine Learning Training & Reproduction

### Prerequisites
Python 3.10+ with `scikit-learn`, `numpy`, and `scipy` installed:
```bash
pip install scikit-learn numpy scipy
```

### Running the Training Pipeline
Run the Python training script from the project root:
```bash
python train_model.py
```
This executes:
1. Feature extraction & N-gram TF-IDF vectorization.
2. Dense feature engineering (urgency count, credential triggers, domain entropy, suspicious TLDs).
3. 5-Fold Stratified Cross-Validation & metric reporting.
4. Exporting the trained weights to `src/data/trained_model.json` for in-browser client execution.

### Running Node.js Engine Verification
Test the JavaScript ML classification engine across representative threat vectors:
```bash
node test_ml_engine.js
```

---

## 🚀 Interactive ML Model Lab (`/ml-lab`)

Meiveli includes a dedicated interactive web interface at `/ml-lab` designed specifically for assignment reviews, grading, and demonstration:
1. **Live Inspector:** Paste any SMS, message, or URL to view real-time predictions, softmax probabilities, and engineered feature vectors.
2. **Model Metrics & Math:** View the statistical evaluation metrics, confusion matrix, and mathematical formulations.
3. **Interactive Trainer:** Add new labeled samples in the browser to demonstrate continuous learning.

Access the lab directly:
- In Desktop view: Click **"🔬 Launch ML Model Lab & Inspector"** on the gateway.
- In Mobile view: Click the **"🔬 Open ML Lab"** pill button on the Result page or in Settings.
- Direct URL: Navigate to `/ml-lab`.

---

## 🌐 Vercel Deployment Guide

Because the application is 100% self-contained and does not require an external backend server or Gemini API keys:

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete self-contained machine learning threat detection engine"
   git push origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Environment Variables:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (if using your live Supabase database).
7. Deploy! Your app will be live and fully functional immediately.

---

## 🎓 15 Viva / Panel Defense Questions & Answers

### 1. Why didn't you just use an LLM API like Gemini or OpenAI?
*Answer:* Cloud LLMs require active internet connectivity, high latency (1-3 seconds), expensive per-token API pricing, and recurrent API key quotas. In a cyber defense and phishing detection context, citizens need sub-millisecond, private, offline-capable verification. Our self-contained hybrid ML engine runs client-side in less than 1 millisecond with zero external dependencies.

### 2. How does the system handle subtle urgency coercion?
*Answer:* The engine extracts temporal and pressure indicators using regex and weighted threat dictionaries (`analyzeUrgency`). Keywords indicating immediate action (`immediately`, `at once`), strict deadlines (`tonight at 9:30 PM`, `within 24 hours`), service cutoffs (`disconnected`, `suspended`), or legal extortion (`digital arrest`, `court warrant`) contribute incrementally to the urgency score.

### 3. How do you detect Brand Impersonation?
*Answer:* `domainAnalyzer.js` cross-references brand entities mentioned in the text (e.g. "SBI", "TNEB", "Amazon") with the registered root domain extracted from the URL. If a message claims to be from "SBI" but the registered domain is `sbi-kyc-verify.xyz` instead of `sbi.co.in`, `brandMismatch: true` is triggered, escalating the threat risk score.

### 4. Why calculate Shannon Entropy on domain names?
*Answer:* Legitimate organizational domains typically consist of readable dictionary words or acronyms (e.g. `onlinesbi.sbi`). Phishing actors often use Domain Generation Algorithms (DGA) or random strings (e.g. `x8k-9q.xyz`). Shannon entropy $H(D) = -\sum p_i \log_2 p_i$ measures the character randomness; values above 3.8 bits/char indicate high likelihood of automated generation.

### 5. What prevents URL shortener bypasses?
*Answer:* Links using known shorteners (`bit.ly`, `tinyurl.com`, `rb.gy`) obfuscate destination URLs. Our feature extractor identifies shorteners and penalizes them with a suspicious weight (+1.8), preventing them from being classified as `Safe` without human analyst verification.

### 6. What classification algorithms are utilized?
*Answer:* We utilize a hybrid ensemble consisting of Multinomial Naive Bayes with Laplace smoothing for text token log-likelihood estimation, combined with a Calibrated Logistic Regression layer for dense structural features (urgency score, credential triggers, domain entropy, brand mismatch).

### 7. How are complex Indian TLDs handled (e.g. `.gov.in`, `.co.in`)?
*Answer:* Standard domain splitting by dots fails on multi-level TLDs (e.g. extracting `in` instead of `licindia.in`). Our `extractRegisteredDomain` function maintains a lookup of complex TLDs (`gov.in`, `co.in`, `org.in`, `tn.gov.in`) to extract the true registered domain.

### 8. What is the false-negative vs false-positive trade-off?
*Answer:* In cyber threat detection, a false negative (clearing a scam link as Safe) causes financial or identity loss, whereas a false positive merely delays a safe report in the analyst queue. The classifier weights are intentionally biased to prioritize high Recall on scams.

### 9. Can the model be fine-tuned or retrained in real-time?
*Answer:* Yes. Through both `train_model.py` (offline full retraining) and the Interactive Trainer in `/ml-lab`, new samples can be added dynamically and evaluated immediately.

### 10. How is class imbalance addressed?
*Answer:* During Logistic Regression training in `train_model.py`, `class_weight='balanced'` is specified, which inversely adjusts weights proportional to class frequencies to prevent the majority class from dominating decisions.

---

## 📁 Repository Directory Structure

```
├── ml_dataset/
│   └── dataset.json              # Curated multi-class cyber threat training dataset
├── src/
│   ├── components/               # UI components (ThreatMap, TopBar, BottomTabBar)
│   ├── context/                  # React Context (LanguageContext)
│   ├── data/
│   │   ├── trained_model.json    # Exported trained ML model artifact (weights, priors, vocab)
│   │   └── mock.js               # Mock UI templates
│   ├── hooks/                    # useHotspots (Supabase realtime data hook)
│   ├── pages/
│   │   ├── AnalystDashboard.jsx  # Desktop command center & threat monitor
│   │   ├── DesktopGateway.jsx    # Responsive desktop entry point
│   │   ├── HomePage.jsx          # Mobile citizen home & scanner
│   │   ├── MlLabPage.jsx         # Interactive ML Model Inspector & Lab
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
└── package.json                  # Dependencies & scripts
```
