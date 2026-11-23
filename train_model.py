"""
Meiveli-NGEM: Threat Detection & Phishing Classification Machine Learning Pipeline
Trains NLP & Lexical feature classifiers for SMS, Web Phishing, and Cyber Threat Detection.
Outputs trained model parameters to `src/data/trained_model.json` for client-side zero-dependency inference.
"""

import json
import math
import re
import os
import datetime
from collections import Counter

import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score, f1_score, precision_score, recall_score
from scipy.sparse import hstack, csr_matrix

# Specialized Threat & Phishing Lexicons
URGENCY_LEXICON = [
    "immediately", "urgent", "urgently", "tonight", "expire", "expires", "suspended",
    "blocked", "deactivated", "deactivation", "disconnect", "disconnected", "disconnection",
    "warning", "alert", "action required", "within 24 hours", "within 12 hours",
    "court warrant", "arrest", "digital arrest", "police", "legal action", "penalty", "fine",
    "due on", "lapse today", "bail"
]

CREDENTIAL_LEXICON = [
    "otp", "pin", "upi pin", "password", "cvv", "pan card", "aadhaar", "kyc",
    "netbanking", "login", "verify", "update kyc", "link aadhaar", "apk", "download apk",
    "anydesk", "teamviewer", "quicksupport", "rustdesk"
]

FINANCIAL_LEXICON = [
    "cashback", "lottery", "won", "reward", "scratch card", "refund", "prize",
    "₹", "rs.", "inr", "free voucher", "gift card", "disbursement", "processing fee",
    "safe account", "transfer money", "bail", "congratulations", "credited"
]

AUTHORITY_LEXICON = [
    "cbi", "cyber crime", "customs", "police", "mumbai customs", "delhi police",
    "tneb", "tangedco", "sbi", "hdfc", "icici", "uidai", "income tax", "rbi",
    "supreme court", "fedex", "bluedart", "india post"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".online", ".site", ".click", ".link", ".vip", ".buzz", ".club", ".store"
]

SHORTENERS = [
    "bit.ly", "tinyurl.com", "rb.gy", "t.co", "is.gd", "buff.ly", "ow.ly"
]

def calculate_shannon_entropy(s):
    """Calculates Shannon Entropy of a string to detect randomized/DGA domain names."""
    if not s:
        return 0.0
    prob = [float(s.count(c)) / len(s) for c in set(s)]
    return -sum(p * math.log2(p) for p in prob)

def extract_urls(text):
    url_regex = r'(https?://[^\s]+)'
    return re.findall(url_regex, text)

def extract_domain_from_url(url):
    try:
        clean = url.split("://")[-1].split("/")[0].split("?")[0].lower()
        return clean
    except Exception:
        return ""

def extract_engineered_features(text):
    """
    Extracts high-signal domain & NLP features:
    [urgency_count, credential_count, financial_count, authority_count,
     has_url, url_count, has_suspicious_tld, is_shortener, has_ip, domain_entropy]
    """
    lower = text.lower()
    urgency_cnt = sum(1 for w in URGENCY_LEXICON if w in lower)
    cred_cnt = sum(1 for w in CREDENTIAL_LEXICON if w in lower)
    fin_cnt = sum(1 for w in FINANCIAL_LEXICON if w in lower)
    auth_cnt = sum(1 for w in AUTHORITY_LEXICON if w in lower)

    urls = extract_urls(text)
    has_url = 1.0 if len(urls) > 0 else 0.0
    url_cnt = float(len(urls))
    has_susp_tld = 0.0
    is_short = 0.0
    has_ip = 0.0
    max_entropy = 0.0

    for u in urls:
        dom = extract_domain_from_url(u)
        if any(dom.endswith(tld) for tld in SUSPICIOUS_TLDS):
            has_susp_tld = 1.0
        if any(dom == s or dom.endswith("." + s) for s in SHORTENERS):
            is_short = 1.0
        if re.match(r'^\d+\.\d+\.\d+\.\d+', dom):
            has_ip = 1.0
        ent = calculate_shannon_entropy(dom)
        if ent > max_entropy:
            max_entropy = ent

    return [
        float(urgency_cnt),
        float(cred_cnt),
        float(fin_cnt),
        float(auth_cnt),
        has_url,
        url_cnt,
        has_susp_tld,
        is_short,
        has_ip,
        round(max_entropy, 2)
    ]

def tokenize(text):
    """Converts text into normalized unigram & bigram tokens."""
    cleaned = re.sub(r'[^a-zA-Z0-9₹]', ' ', text.lower())
    unigrams = [w for w in cleaned.split() if len(w) > 1]
    bigrams = [f"{unigrams[i]}_{unigrams[i+1]}" for i in range(len(unigrams)-1)]
    return unigrams + bigrams

def main():
    print("=" * 65)
    print("  Meiveli Threat Intelligence ML Training Engine (Hybrid NLP + Features)")
    print("=" * 65)

    dataset_path = os.path.join(os.path.dirname(__file__), "ml_dataset", "dataset.json")
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    texts = [item["text"] for item in data]
    labels = [item["label"].lower() for item in data]
    classes = ["safe", "suspicious", "scam"]

    print(f"Loaded {len(data)} training samples across {len(classes)} classes:")
    class_counts = Counter(labels)
    for c in classes:
        print(f"  - {c.upper()}: {class_counts[c]} samples")

    # 1. Feature Extraction (TF-IDF + Engineered Dense Features)
    vec = TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_features=300)
    X_tfidf = vec.fit_transform(texts)
    dense_feats = np.array([extract_engineered_features(t) for t in texts])
    X = hstack([X_tfidf, csr_matrix(dense_feats)]).tocsr()
    y = np.array([classes.index(lbl) for lbl in labels])

    # 2. Train Logistic Regression Classifier with class balancing
    clf = LogisticRegression(max_iter=1000, C=2.0, class_weight='balanced', random_state=42)

    # 5-Fold Stratified Cross-Validation
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    y_preds = []
    y_trues = []

    for train_idx, test_idx in skf.split(X, y):
        clf.fit(X[train_idx], y[train_idx])
        preds = clf.predict(X[test_idx])
        y_preds.extend(preds)
        y_trues.extend(y[test_idx])

    acc = accuracy_score(y_trues, y_preds)
    prec = precision_score(y_trues, y_preds, average="weighted", zero_division=0)
    rec = recall_score(y_trues, y_preds, average="weighted", zero_division=0)
    f1 = f1_score(y_trues, y_preds, average="weighted", zero_division=0)
    cm = confusion_matrix(y_trues, y_preds).tolist()

    print("\nStratified 5-Fold Cross-Validation Performance:")
    print(f"  Accuracy:  {acc*100:.2f}%")
    print(f"  Precision: {prec*100:.2f}%")
    print(f"  Recall:    {rec*100:.2f}%")
    print(f"  F1 Score:  {f1*100:.2f}%")
    print("  Confusion Matrix:")
    print(f"    Safe       [True]: Predicted -> {cm[0]}")
    print(f"    Suspicious [True]: Predicted -> {cm[1]}")
    print(f"    Scam       [True]: Predicted -> {cm[2]}")

    # Retrain on full dataset for export
    clf.fit(X, y)

    # Extract word and feature importance weights
    vocab = vec.get_feature_names_out().tolist()
    feature_names = vocab + [
        "feat_urgency_count", "feat_credential_count", "feat_financial_count", "feat_authority_count",
        "feat_has_url", "feat_url_count", "feat_has_suspicious_tld", "feat_is_shortener", "feat_has_ip", "feat_entropy"
    ]

    class_weights = {}
    for i, c in enumerate(classes):
        coefs = clf.coef_[i]
        top_indices = np.argsort(coefs)[::-1][:20]
        top_words = {feature_names[idx]: round(float(coefs[idx]), 4) for idx in top_indices}
        class_weights[c] = top_words

    # Compute naive bayes / word log likelihoods for client-side Bayesian scoring
    tokenized_docs = [tokenize(t) for t in texts]
    all_vocab = sorted(list(set(w for tokens in tokenized_docs for w in tokens)))
    V = len(all_vocab)
    word_counts_per_class = {c: Counter() for c in classes}
    total_words_per_class = {c: 0 for c in classes}
    for tokens, label in zip(tokenized_docs, labels):
        word_counts_per_class[label].update(tokens)
        total_words_per_class[label] += len(tokens)

    word_log_probs = {c: {} for c in classes}
    for c in classes:
        denom = total_words_per_class[c] + V
        for w in all_vocab:
            cnt = word_counts_per_class[c][w]
            word_log_probs[c][w] = round(math.log((cnt + 1) / denom), 4)

    metrics = {
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": cm,
        "classes": classes
    }

    model_artifact = {
        "metadata": {
            "model_name": "Meiveli-ThreatClassifier-Hybrid-LR-Bayes",
            "version": "2.1.0",
            "architecture": "Calibrated Logistic Regression + Bayesian NLP + Domain Heuristic Ensembling",
            "trained_at": datetime.datetime.now().isoformat(),
            "samples_count": len(data),
            "classes": classes,
            "metrics": metrics
        },
        "intercept": [round(float(b), 4) for b in clf.intercept_],
        "top_feature_weights": class_weights,
        "word_log_probs": word_log_probs,
        "lexicons": {
            "urgency": URGENCY_LEXICON,
            "credentials": CREDENTIAL_LEXICON,
            "financial": FINANCIAL_LEXICON,
            "authority": AUTHORITY_LEXICON,
            "suspicious_tlds": SUSPICIOUS_TLDS,
            "shorteners": SHORTENERS
        },
        "heuristics": {
            "urgency_weight": 2.0,
            "credential_weight": 2.5,
            "financial_weight": 1.5,
            "brand_mismatch_weight": 3.5,
            "suspicious_tld_weight": 2.2,
            "shortener_weight": 1.8,
            "raw_ip_weight": 2.8,
            "trusted_domain_discount": -4.0
        }
    }

    out_file = os.path.join(os.path.dirname(__file__), "src", "data", "trained_model.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(model_artifact, f, indent=2)

    print(f"\nModel artifact successfully saved to: {out_file} ({os.path.getsize(out_file):,} bytes)")
    print("=" * 65)

if __name__ == "__main__":
    main()
