// src/utils/mlEngine.js
// Independent, self-contained Machine Learning Threat & Phishing Detection Engine
// Zero external API calls required. Runs 100% locally in browser or Node.js.

import modelArtifact from '../data/trained_model.json' with { type: 'json' };
import { extractUrls, extractRegisteredDomain, buildDomainIntelligence } from './domainAnalyzer.js';
import { TRUSTED_DOMAINS, COMMON_URL_SHORTENERS, TUNNEL_SERVICES } from './trustedDomains.js';

/**
 * Calculates Shannon Entropy of a string to detect randomized/DGA domain names.
 * High entropy indicates random/algorithmically generated strings often used in phishing.
 */
export function calculateShannonEntropy(str) {
  if (!str || str.length === 0) return 0;
  const frequencies = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

/**
 * Tokenizes text into unigrams and bigrams.
 */
export function tokenizeText(text) {
  if (!text) return [];
  const clean = text.toLowerCase().replace(/[^a-zA-Z0-9₹]/g, ' ');
  const unigrams = clean.split(/\s+/).filter(w => w.length > 1);
  const bigrams = [];
  for (let i = 0; i < unigrams.length - 1; i++) {
    bigrams.push(`${unigrams[i]}_${unigrams[i + 1]}`);
  }
  return [...unigrams, ...bigrams];
}

/**
 * Analyzes urgency patterns and triggers in the message.
 */
export function analyzeUrgency(text) {
  if (!text) return { score: 0, matches: [], level: 'LOW' };
  const lower = text.toLowerCase();
  
  const urgencyRules = [
    { pattern: /\b(immediately|urgent|urgently|right now|at once)\b/i, weight: 25, label: "Immediate Action Required" },
    { pattern: /\b(tonight|today|within \d+ (hours?|mins?|minutes?)|before \d+ (pm|am))\b/i, weight: 20, label: "Strict Deadline / Time Pressure" },
    { pattern: /\b(disconnect(ed|ion)?|power cut|suspended|deactivat(ed|ion)|blocked|terminated)\b/i, weight: 30, label: "Service Disconnection / Account Suspension Threat" },
    { pattern: /\b(arrest|digital arrest|police|court warrant|fir|legal action|penalty|fine)\b/i, weight: 35, label: "Legal / Arrest Extortion Threat" },
    { pattern: /\b(lapse|expire[sd]?|last chance|final notice)\b/i, weight: 15, label: "Expiration / Final Warning" }
  ];

  let score = 0;
  const matches = [];

  for (const rule of urgencyRules) {
    const match = lower.match(rule.pattern);
    if (match) {
      score += rule.weight;
      matches.push(rule.label);
    }
  }

  score = Math.min(100, score);
  const level = score >= 50 ? 'HIGH' : score >= 20 ? 'MEDIUM' : 'LOW';

  return { score, matches, level };
}

/**
 * Analyzes credential theft and sensitive data harvesting triggers.
 */
export function analyzeCredentials(text) {
  if (!text) return { score: 0, matches: [], level: 'LOW' };
  const lower = text.toLowerCase();

  const credentialRules = [
    { pattern: /\b(upi pin|pin|mpin)\b/i, weight: 45, label: "UPI PIN Requested (Extreme Risk)" },
    { pattern: /\b(otp|one time password)\b/i, weight: 35, label: "OTP Requested" },
    { pattern: /\b(cvv|card expiry|debit card|credit card details)\b/i, weight: 35, label: "Banking Card Details Requested" },
    { pattern: /\b(pan card|aadhaar|update kyc|kyc pending|link aadhaar)\b/i, weight: 30, label: "Sensitive Government ID / KYC Trigger" },
    { pattern: /\b(\.apk|download apk|install app|anydesk|teamviewer|quicksupport|rustdesk)\b/i, weight: 45, label: "Malicious APK or Remote Access App Prompt" }
  ];

  let score = 0;
  const matches = [];

  for (const rule of credentialRules) {
    if (rule.pattern.test(lower)) {
      score += rule.weight;
      matches.push(rule.label);
    }
  }

  score = Math.min(100, score);
  const level = score >= 50 ? 'HIGH' : score >= 20 ? 'MEDIUM' : 'LOW';

  return { score, matches, level };
}

/**
 * Analyzes financial bait and reward triggers.
 */
export function analyzeFinancialTriggers(text) {
  if (!text) return { score: 0, matches: [] };
  const lower = text.toLowerCase();

  const financialRules = [
    { pattern: /\b(won|winner|lottery|prize|lucky draw|scratch card)\b/i, weight: 35, label: "Fake Lottery / Prize Bait" },
    { pattern: /\b(cashback|reward points|gift card|free voucher)\b/i, weight: 25, label: "Cashback / Reward Points Bait" },
    { pattern: /\b(refund of ₹|income tax refund|processing fee|bail money|safe account)\b/i, weight: 35, label: "Escrow / Advance Fee Trap" },
    { pattern: /₹\s*[\d,]+|rs\.?\s*[\d,]+/i, weight: 10, label: "Monetary Amounts Stated" }
  ];

  let score = 0;
  const matches = [];

  for (const rule of financialRules) {
    if (rule.pattern.test(lower)) {
      score += rule.weight;
      matches.push(rule.label);
    }
  }

  return { score: Math.min(100, score), matches };
}

/**
 * Core Machine Learning Phishing Classifier.
 * Combines Bayesian Text Likelihood + Feature Engineering + Domain Intelligence.
 */
export function classifyThreatWithML(text, imageBase64 = null) {
  const combinedText = text || '';
  const tokens = tokenizeText(combinedText);
  const classes = modelArtifact.metadata.classes || ['safe', 'suspicious', 'scam'];
  const wordLogProbs = modelArtifact.word_log_probs || {};
  const priors = modelArtifact.priors || { safe: -1.09, suspicious: -1.09, scam: -1.09 };

  // 1. Compute Bayesian Log-Likelihood for each class
  const classScores = {};
  for (const c of classes) {
    let logLikelihood = priors[c] || 0;
    const vocabProbs = wordLogProbs[c] || {};
    
    // Evaluate token log probabilities
    for (const token of tokens) {
      if (vocabProbs[token] !== undefined) {
        logLikelihood += vocabProbs[token];
      }
    }
    classScores[c] = logLikelihood;
  }

  // 2. High-Signal Feature Extraction
  const urgency = analyzeUrgency(combinedText);
  const credentials = analyzeCredentials(combinedText);
  const financial = analyzeFinancialTriggers(combinedText);
  const domainIntelligence = buildDomainIntelligence(combinedText);

  // 3. Domain & URL Lexical Analysis
  let hasTrustedDomain = false;
  let hasBrandMismatch = false;
  let hasSuspiciousTld = false;
  let hasShortener = false;
  let hasTunnel = false;
  let hasRawIp = false;
  let maxEntropy = 0;
  let matchedTrustedOrg = null;

  for (const intel of domainIntelligence) {
    if (intel.trusted) {
      hasTrustedDomain = true;
      matchedTrustedOrg = intel.organization;
    }
    if (intel.signals.brandMismatch) hasBrandMismatch = true;
    if (intel.signals.suspiciousTld) hasSuspiciousTld = true;
    if (intel.signals.shortener) hasShortener = true;
    if (intel.signals.tunnelService) hasTunnel = true;
    if (intel.signals.rawIp) hasRawIp = true;

    const entropy = calculateShannonEntropy(intel.registeredDomain);
    if (entropy > maxEntropy) maxEntropy = entropy;
  }

  // 4. Feature Adjustments (calibrated logistic feature layer)
  const heuristics = modelArtifact.heuristics || {
    urgency_weight: 2.0,
    credential_weight: 2.5,
    financial_weight: 1.5,
    brand_mismatch_weight: 3.5,
    suspicious_tld_weight: 2.2,
    shortener_weight: 1.8,
    raw_ip_weight: 2.8,
    trusted_domain_discount: -4.0
  };

  let scamLogitModifier = 0;
  let suspiciousLogitModifier = 0;
  let safeLogitModifier = 0;

  if (urgency.score > 40) scamLogitModifier += heuristics.urgency_weight;
  if (credentials.score > 30) scamLogitModifier += heuristics.credential_weight;
  if (financial.score > 30) scamLogitModifier += heuristics.financial_weight;

  if (hasBrandMismatch) {
    scamLogitModifier += heuristics.brand_mismatch_weight;
  }

  if (hasSuspiciousTld) {
    scamLogitModifier += heuristics.suspicious_tld_weight;
    suspiciousLogitModifier += 1.0;
  }

  if (hasShortener || hasTunnel) {
    suspiciousLogitModifier += heuristics.shortener_weight;
  }

  if (hasRawIp) {
    suspiciousLogitModifier += heuristics.raw_ip_weight;
  }

  if (maxEntropy > 3.8) {
    suspiciousLogitModifier += 1.5;
  }

  if (hasTrustedDomain && !hasBrandMismatch) {
    safeLogitModifier += Math.abs(heuristics.trusted_domain_discount);
    scamLogitModifier -= 3.0;
  }

  // Apply modifiers
  classScores.scam = (classScores.scam || 0) + scamLogitModifier;
  classScores.suspicious = (classScores.suspicious || 0) + suspiciousLogitModifier;
  classScores.safe = (classScores.safe || 0) + safeLogitModifier;

  // 5. Softmax to obtain calibrated probabilities
  const maxScore = Math.max(classScores.safe, classScores.suspicious, classScores.scam);
  const expSafe = Math.exp(classScores.safe - maxScore);
  const expSusp = Math.exp(classScores.suspicious - maxScore);
  const expScam = Math.exp(classScores.scam - maxScore);
  const sumExp = expSafe + expSusp + expScam;

  const probSafe = expSafe / sumExp;
  const probSusp = expSusp / sumExp;
  const probScam = expScam / sumExp;

  // 6. Final Decision & Calibrated Risk Score (0 - 100)
  let verdict = 'safe';
  let riskScore = Math.round((probScam * 90) + (probSusp * 45) + (probSafe * 5));

  // Boundary condition overrides for deterministic safety / critical scam patterns
  if (hasBrandMismatch || (credentials.score >= 50 && urgency.score >= 40) || (hasSuspiciousTld && (urgency.score >= 30 || credentials.score >= 30))) {
    verdict = 'scam';
    riskScore = Math.max(riskScore, 85);
  } else if (hasShortener || hasTunnel || hasSuspiciousTld || (urgency.score >= 30 && !hasTrustedDomain) || probSusp > 0.45) {
    verdict = probScam > 0.6 ? 'scam' : 'suspicious';
    riskScore = verdict === 'scam' ? Math.max(riskScore, 75) : Math.max(riskScore, 48);
  } else if (hasTrustedDomain && !hasBrandMismatch && credentials.score < 35 && urgency.score < 50) {
    verdict = 'safe';
    riskScore = Math.min(riskScore, 12);
  } else if (probScam >= 0.5) {
    verdict = 'scam';
    riskScore = Math.max(riskScore, 75);
  } else if (probSusp >= 0.4) {
    verdict = 'suspicious';
    riskScore = Math.max(riskScore, 45);
  } else {
    verdict = 'safe';
    riskScore = Math.min(riskScore, 20);
  }

  // 7. Explainable AI (XAI) Signal Generation
  const signals = [];

  // Urgency Signal
  if (urgency.score > 0) {
    signals.push({
      key: 'urgency',
      title: `${urgency.level} Urgency Pressure Detected (${urgency.score}/100)`,
      detail: urgency.matches.length > 0 ? urgency.matches.join(' • ') : 'Message creates artificial panic or deadlines.'
    });
  }

  // Credential Signal
  if (credentials.score > 0) {
    signals.push({
      key: 'credentials',
      title: `Sensitive Credential Trigger (${credentials.level})`,
      detail: credentials.matches.join(' • ')
    });
  }

  // Brand Mismatch Signal
  if (hasBrandMismatch) {
    signals.push({
      key: 'brand',
      title: 'Brand Impersonation Detected',
      detail: 'The sender references a recognized company/bank, but the link points to an unverified third-party domain.'
    });
  }

  // URL / TLD Signal
  if (hasSuspiciousTld) {
    signals.push({
      key: 'domain',
      title: 'Suspicious Domain Extension (TLD)',
      detail: 'The link uses a high-risk generic extension (.xyz, .top, .online) commonly favored in disposable phishing sites.'
    });
  } else if (hasShortener) {
    signals.push({
      key: 'link',
      title: 'Obfuscated Link (URL Shortener)',
      detail: 'The destination link is masked using a link shortening service.'
    });
  } else if (hasTrustedDomain && !hasBrandMismatch) {
    signals.push({
      key: 'domain',
      title: `Verified Official Entity: ${matchedTrustedOrg || 'Legitimate Entity'}`,
      detail: 'The domain matches official whitelisted banking or government infrastructure.'
    });
  }

  // Financial Signal
  if (financial.score > 0) {
    signals.push({
      key: 'money',
      title: 'Financial Trigger & Bait Detected',
      detail: financial.matches.join(' • ')
    });
  }

  // If safe with no signals
  if (signals.length === 0 && verdict === 'safe') {
    signals.push({
      key: 'domain',
      title: 'No Known Threat Footprint',
      detail: 'No credential theft, urgency coercion, or blacklisted domains were observed.'
    });
  }

  // Extract detected URLs
  const detectedUrls = domainIntelligence.map(d => d.url);

  return {
    score: riskScore,
    verdict: verdict,
    signals: signals.slice(0, 5),
    urls: detectedUrls,
    similarReports: verdict !== 'safe' ? 'Identified by Meiveli Local Threat Intelligence' : null,
    probabilities: {
      safe: Number((probSafe * 100).toFixed(1)),
      suspicious: Number((probSusp * 100).toFixed(1)),
      scam: Number((probScam * 100).toFixed(1))
    },
    features: {
      urgencyScore: urgency.score,
      urgencyLevel: urgency.level,
      credentialScore: credentials.score,
      financialScore: financial.score,
      domainEntropy: maxEntropy,
      hasTrustedDomain,
      hasBrandMismatch,
      hasSuspiciousTld,
      hasShortener
    },
    mlMetadata: {
      modelName: modelArtifact.metadata.modelName,
      architecture: modelArtifact.metadata.architecture,
      accuracy: `${(modelArtifact.metadata.metrics.accuracy * 100).toFixed(1)}%`,
      f1Score: `${(modelArtifact.metadata.metrics.f1_score * 100).toFixed(1)}%`,
      version: modelArtifact.metadata.version,
      engine: 'Self-Contained Browser/Node ML'
    }
  };
}
