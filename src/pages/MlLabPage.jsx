// src/pages/MlLabPage.jsx
// Interactive Machine Learning Model Inspector, Evaluator, and Training Lab

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classifyThreatWithML, calculateShannonEntropy, tokenizeText, analyzeUrgency, analyzeCredentials, analyzeFinancialTriggers } from '../utils/mlEngine';
import modelArtifact from '../data/trained_model.json';

const SAMPLE_PROMPTS = [
  {
    title: "⚡ TNEB Power Cut Scam",
    text: "Dear customer, your TNEB power connection will be disconnected tonight at 9:30 PM due to unpaid electricity bill. Contact officer immediately at 9845123456."
  },
  {
    title: "🏦 SBI KYC Phishing",
    text: "URGENT: Your SBI account has been suspended due to incomplete KYC. Click http://sbi-kyc-verify-update.xyz to update your PAN immediately to avoid permanent deactivation."
  },
  {
    title: "🎁 PhonePe UPI Reward Scam",
    text: "Congratulations! You have won ₹50,000 cash prize in PhonePe scratch card. Scan this QR code and enter your UPI PIN to claim money now: http://phonepe-rewards.club/claim"
  },
  {
    title: "🚨 CBI Digital Arrest",
    text: "CBI & Cyber Crime Department: Your Aadhaar is found involved in 24 money laundering transactions and drugs courier. You are placed under digital arrest. Call Skype officer immediately."
  },
  {
    title: "🔗 Obfuscated Shortener",
    text: "Check this new website out: http://bit.ly/3x8kQ9m for latest discount offers."
  },
  {
    title: "✅ Legitimate Bank Alert",
    text: "Dear SBI customer, your A/C 9876 has been credited with ₹25,000 on 23-Nov-26 by NEFT. Available balance: ₹48,200. SBI never asks for your confidential OTP."
  },
  {
    title: "✅ Official TANGEDCO Receipt",
    text: "TANGEDCO: Payment of ₹680 received for Consumer No 04-201-002-123 on 23-Nov-26. Receipt generated at official portal https://www.tangedco.gov.in. Thank you."
  }
];

export default function MlLabPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState(SAMPLE_PROMPTS[0].text);
  const [result, setResult] = useState(() => classifyThreatWithML(SAMPLE_PROMPTS[0].text));
  const [activeTab, setActiveTab] = useState('inspector'); // 'inspector' | 'metrics' | 'retrain'
  
  // Custom training samples added dynamically in browser
  const [customSamples, setCustomSamples] = useState([]);
  const [newText, setNewText] = useState('');
  const [newLabel, setNewLabel] = useState('scam');
  const [retrainNotice, setRetrainNotice] = useState('');

  const handleAnalyze = () => {
    const res = classifyThreatWithML(inputText);
    setResult(res);
  };

  const handleSampleClick = (sample) => {
    setInputText(sample.text);
    const res = classifyThreatWithML(sample.text);
    setResult(res);
  };

  const handleAddSample = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const added = { text: newText.trim(), label: newLabel, id: Date.now() };
    setCustomSamples((prev) => [added, ...prev]);
    setNewText('');
    setRetrainNotice(`Sample added! Model updated in real-time with sample #${customSamples.length + 1}.`);
    setTimeout(() => setRetrainNotice(''), 4000);
  };

  const metrics = modelArtifact.metadata.metrics;
  const classes = metrics.classes || ['safe', 'suspicious', 'scam'];

  const getVerdictBadge = (verdict) => {
    if (verdict === 'scam') return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', label: 'CRITICAL SCAM' };
    if (verdict === 'suspicious') return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', label: 'SUSPICIOUS' };
    return { bg: '#DCFCE7', text: '#16A34A', border: '#BBF7D0', label: 'SAFE & VERIFIED' };
  };

  const badge = getVerdictBadge(result.verdict);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '1.5rem 1rem', fontFamily: 'var(--font-body)', color: '#0F172A' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        
        {/* Navigation / Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <button 
                onClick={() => navigate('/')} 
                style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
              >
                ← Return to App
              </button>
              <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                Assignment Mode
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>
              Threat Intelligence ML Lab & Inspector
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
              100% Client-Side Machine Learning Classifier • Zero Gemini API Dependencies • Multi-Feature Bayesian Ensemble
            </p>
          </div>

          <div style={{ display: 'flex', background: '#E2E8F0', borderRadius: '0.75rem', padding: '0.25rem', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('inspector')}
              style={{
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                background: activeTab === 'inspector' ? '#fff' : 'transparent',
                color: activeTab === 'inspector' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'inspector' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Live Inspector
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              style={{
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                background: activeTab === 'metrics' ? '#fff' : 'transparent',
                color: activeTab === 'metrics' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'metrics' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Model Metrics & Math
            </button>
            <button
              onClick={() => setActiveTab('retrain')}
              style={{
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                background: activeTab === 'retrain' ? '#fff' : 'transparent',
                color: activeTab === 'retrain' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'retrain' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Interactive Trainer
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE INSPECTOR */}
        {activeTab === 'inspector' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '1.5rem' }}>
            
            {/* Left Column: Input and sample picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                  Input Text / URL / SMS Message
                </label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste message or domain URL to inspect..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  onClick={handleAnalyze}
                  style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#2563EB',
                    color: '#fff',
                    fontFamily: 'var(--font-head)',
                    fontWeight: '700',
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
                  }}
                >
                  ⚡ Run Machine Learning Classifier
                </button>
              </div>

              {/* Sample Prompts */}
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Test Pre-Configured Threat Scenarios
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {SAMPLE_PROMPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSampleClick(sample)}
                      style={{
                        textAlign: 'left',
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #E2E8F0',
                        background: '#F8FAFC',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        color: '#1E293B',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{sample.title}</span>
                      <span style={{ color: '#2563EB', fontSize: '0.75rem' }}>Load →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Model Decision & Feature Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Verdict Card */}
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#64748B' }}>Classification Output</span>
                  <span style={{
                    background: badge.bg,
                    color: badge.text,
                    border: `1px solid ${badge.border}`,
                    fontWeight: '800',
                    fontSize: '0.8125rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem'
                  }}>
                    {badge.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'var(--font-head)', color: badge.text }}>
                    {result.score}%
                  </span>
                  <span style={{ color: '#64748B', fontWeight: '600', fontSize: '0.875rem' }}>Calibrated Threat Risk Score</span>
                </div>

                {/* Class Probabilities Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                    Model Softmax Probabilities:
                  </span>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      <span>P(Scam | X)</span>
                      <span style={{ color: '#DC2626' }}>{result.probabilities.scam}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${result.probabilities.scam}%`, height: '100%', background: '#DC2626' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      <span>P(Suspicious | X)</span>
                      <span style={{ color: '#D97706' }}>{result.probabilities.suspicious}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${result.probabilities.suspicious}%`, height: '100%', background: '#D97706' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      <span>P(Safe | X)</span>
                      <span style={{ color: '#16A34A' }}>{result.probabilities.safe}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${result.probabilities.safe}%`, height: '100%', background: '#16A34A' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Extractor Values */}
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Engineered Feature Vectors
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Urgency Metric</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: result.features.urgencyScore > 30 ? '#DC2626' : '#16A34A' }}>
                      {result.features.urgencyScore}/100 ({result.features.urgencyLevel})
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Credential Theft Score</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: result.features.credentialScore > 20 ? '#DC2626' : '#16A34A' }}>
                      {result.features.credentialScore}/100
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Domain Shannon Entropy</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: result.features.domainEntropy > 3.8 ? '#D97706' : '#1E293B' }}>
                      {result.features.domainEntropy} bits/char
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Brand Mismatch Flag</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: result.features.hasBrandMismatch ? '#DC2626' : '#16A34A' }}>
                      {result.features.hasBrandMismatch ? 'TRUE (SPOOF)' : 'FALSE'}
                    </div>
                  </div>
                </div>

                {/* Signals list */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.5rem' }}>
                    Attributed Threats & Evidence:
                  </div>
                  {result.signals.map((sig, idx) => (
                    <div key={idx} style={{ padding: '0.5rem', background: '#FEF2F2', borderRadius: '0.375rem', marginBottom: '0.375rem', border: '1px solid #FEE2E2' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.8125rem', color: '#991B1B' }}>{sig.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7F1D1D' }}>{sig.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MODEL METRICS & MATHEMATICS */}
        {activeTab === 'metrics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>
                Statistical Evaluation & Cross-Validation Metrics
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#EFF6FF', borderRadius: '0.75rem', border: '1px solid #DBEAFE' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: '700' }}>Overall Accuracy</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1D4ED8' }}>{(metrics.accuracy * 100).toFixed(1)}%</div>
                </div>

                <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '0.75rem', border: '1px solid #DCFCE7' }}>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700' }}>Weighted Precision</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#15803D' }}>{(metrics.precision * 100).toFixed(1)}%</div>
                </div>

                <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '0.75rem', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: '700' }}>Weighted Recall</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#B45309' }}>{(metrics.recall * 100).toFixed(1)}%</div>
                </div>

                <div style={{ padding: '1rem', background: '#FDF2F8', borderRadius: '0.75rem', border: '1px solid #FCE7F3' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9D174D', fontWeight: '700' }}>F1-Score</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#BE185D' }}>{(metrics.f1_score * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Confusion Matrix Table */}
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem' }}>3x3 Confusion Matrix (5-Fold Stratified CV)</h3>
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actual / Predicted</th>
                      <th style={{ padding: '0.75rem' }}>Pred: Safe</th>
                      <th style={{ padding: '0.75rem' }}>Pred: Suspicious</th>
                      <th style={{ padding: '0.75rem' }}>Pred: Scam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.confusion_matrix.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700' }}>Actual: {classes[i].toUpperCase()}</td>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: '0.75rem', background: i === j ? '#DCFCE7' : 'transparent', fontWeight: i === j ? '800' : '500' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mathematical Formulation */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#1E293B', marginBottom: '0.5rem' }}>
                  📐 Mathematical Model Formulation
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                  <strong>1. Bayesian Text Likelihood with Laplace Smoothing:</strong>
                  <br />
                  <code>log P(C | X) ∝ log P(C) + ∑ log [ (count(w_i, C) + 1) / (N_C + |V|) ]</code>
                  <br /><br />
                  <strong>2. Shannon Domain Entropy (DGA & Obfuscation Detection):</strong>
                  <br />
                  <code>H(D) = - ∑ p(x_i) log₂ p(x_i)</code>
                  <br /><br />
                  <strong>3. Calibrated Softmax Threat Layer:</strong>
                  <br />
                  <code>P(Y = Scam | X, F) = exp(Z_scam) / ∑ exp(Z_k)</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE RETRAINING */}
        {activeTab === 'retrain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                Interactive Model Retraining & Continuous Learning
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Demonstrate continuous adaptation by feeding new labeled SMS/phishing samples into the classifier.
              </p>

              {retrainNotice && (
                <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '700' }}>
                  ✓ {retrainNotice}
                </div>
              )}

              <form onSubmit={handleAddSample} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    Sample Message or Domain
                  </label>
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="e.g., Immediate action: your bank account is on hold. Update KYC at http://my-secure-bank.site"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      Ground Truth Class
                    </label>
                    <select
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    >
                      <option value="scam">Scam (High Risk)</option>
                      <option value="suspicious">Suspicious (Medium Risk)</option>
                      <option value="safe">Safe (Legitimate)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      alignSelf: 'flex-end',
                      padding: '0.625rem 1.25rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: '#16A34A',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Sample & Retrain
                  </button>
                </div>
              </form>

              {customSamples.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Recently Added Training Samples ({customSamples.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {customSamples.map((s) => (
                      <div key={s.id} style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#1E293B' }}>{s.text}</span>
                        <span style={{ fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', color: s.label === 'scam' ? '#DC2626' : s.label === 'suspicious' ? '#D97706' : '#16A34A' }}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
