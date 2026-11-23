// test_ml_engine.js
import { classifyThreatWithML, calculateShannonEntropy, tokenizeText, analyzeUrgency, analyzeCredentials } from './src/utils/mlEngine.js';

const testCases = [
  {
    name: "TNEB Power Cut Extortion",
    text: "Dear customer, your TNEB power connection will be disconnected tonight at 9:30 PM due to unpaid electricity bill. Contact officer immediately at 9845123456.",
    expected: "scam"
  },
  {
    name: "SBI KYC Phishing with Brand Mismatch",
    text: "URGENT: Your SBI account has been suspended due to incomplete KYC. Click http://sbi-kyc-verify-update.xyz to update your PAN immediately to avoid permanent deactivation.",
    expected: "scam"
  },
  {
    name: "PhonePe UPI PIN Theft",
    text: "Congratulations! You have won ₹50,000 cash prize in PhonePe scratch card. Scan this QR code and enter your UPI PIN to claim money now: http://phonepe-rewards.club/claim",
    expected: "scam"
  },
  {
    name: "Shortened Link (Obfuscated)",
    text: "Check this new website out: http://bit.ly/3x8kQ9m for latest discount offers.",
    expected: "suspicious"
  },
  {
    name: "Legitimate SBI Transaction Alert",
    text: "Dear SBI customer, your A/C 9876 has been credited with ₹25,000 on 23-Nov-26 by NEFT. Available balance: ₹48,200. SBI never asks for your confidential OTP.",
    expected: "safe"
  },
  {
    name: "Legitimate TANGEDCO Receipt",
    text: "TANGEDCO: Payment of ₹680 received for Consumer No 04-201-002-123 on 23-Nov-26. Receipt generated at official portal https://www.tangedco.gov.in. Thank you.",
    expected: "safe"
  }
];

console.log("==================================================");
console.log("🧪 TESTING MEIVELI ML THREAT ENGINE");
console.log("==================================================");

let passed = 0;
for (const tc of testCases) {
  const result = classifyThreatWithML(tc.text);
  const ok = result.verdict === tc.expected;
  if (ok) passed++;

  console.log(`\nTest: ${tc.name}`);
  console.log(`Text: "${tc.text.slice(0, 75)}..."`);
  console.log(`Result: Verdict = ${result.verdict.toUpperCase()} (Score: ${result.score}%) [Expected: ${tc.expected.toUpperCase()}] -> ${ok ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Probabilities: Safe=${result.probabilities.safe}%, Suspicious=${result.probabilities.suspicious}%, Scam=${result.probabilities.scam}%`);
  console.log(`Signals: ${result.signals.map(s => s.title).join(' | ')}`);
}

console.log("\n==================================================");
console.log(`Summary: ${passed}/${testCases.length} tests passed (${Math.round((passed/testCases.length)*100)}%)`);
console.log("==================================================");
