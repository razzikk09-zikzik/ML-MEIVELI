// src/utils/analyze.js
// Independent Machine Learning Threat Detection Engine (Replaces external Gemini API)

import { classifyThreatWithML } from './mlEngine';

export const VERDICT_META = {
  scam: {
    title: 'Likely a scam',
    sub: 'Very high risk',
    bannerBg: '#FEE2E2',
    bannerBorder: '#FECACA',
    iconColor: '#DC2626',
    color: '#DC2626',
  },
  suspicious: {
    title: 'Suspicious',
    sub: 'Medium risk',
    bannerBg: '#FEF3C7',
    bannerBorder: '#FDE68A',
    iconColor: '#D97706',
    color: '#B45309',
  },
  safe: {
    title: 'Looks safe',
    sub: 'Low risk',
    bannerBg: '#DCFCE7',
    bannerBorder: '#BBF7D0',
    iconColor: '#16A34A',
    color: '#15803D',
  },
};

/**
 * Analyzes text and URLs using our self-contained ML Threat Classifier.
 * Requires NO external API key, NO Gemini dependencies, and works 100% offline or on Vercel.
 */
export async function analyzeWithML(text, imageBase64 = null) {
  // Simulate slight async processing for smooth UI loading indicator (approx 350ms)
  await new Promise(resolve => setTimeout(resolve, 350));

  let textToAnalyze = text || '';

  // If image is provided, ensure we flag that visual scanning was conducted
  if (imageBase64 && !textToAnalyze.trim()) {
    textToAnalyze = "Uploaded Screenshot Evidence";
  }

  const mlResult = classifyThreatWithML(textToAnalyze, imageBase64);

  return {
    score: mlResult.score,
    verdict: mlResult.verdict,
    signals: mlResult.signals,
    urls: mlResult.urls,
    similarReports: mlResult.similarReports,
    probabilities: mlResult.probabilities,
    features: mlResult.features,
    mlMetadata: mlResult.mlMetadata
  };
}

/**
 * Backward compatibility alias: redirects any previous calls to our local ML engine.
 */
export const analyzeWithGemini = analyzeWithML;
