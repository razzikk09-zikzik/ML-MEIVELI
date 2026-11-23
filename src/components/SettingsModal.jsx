// src/components/SettingsModal.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import modelArtifact from '../data/trained_model.json';

export default function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const [sensitivity, setSensitivity] = useState('standard');

  useEffect(() => {
    const saved = localStorage.getItem('MEYVIZHI_ML_SENSITIVITY') || 'standard';
    setSensitivity(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('MEYVIZHI_ML_SENSITIVITY', sensitivity);
    onClose();
  };

  const handleOpenLab = () => {
    onClose();
    navigate('/ml-lab');
  };

  const metrics = modelArtifact.metadata.metrics;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '26rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🧠</span>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '1.25rem', color: '#0f172a' }}>
            ML Detection Engine
          </h2>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Self-contained machine learning classifier. Runs 100% locally with zero external API dependencies.
        </p>

        {/* Engine Status Badge */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700' }}>Engine Status</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#15803D' }}>Active & Self-Sufficient</div>
          </div>
          <span style={{ background: '#22C55E', color: '#fff', fontSize: '0.6875rem', fontWeight: '800', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
            NO API KEY NEEDED
          </span>
        </div>

        {/* Specs Table */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
          <div><strong>Architecture:</strong> Calibrated Bayes + Logistic Ensemble</div>
          <div><strong>Cross-Val Accuracy:</strong> {(metrics.accuracy * 100).toFixed(1)}% (F1: {(metrics.f1_score * 100).toFixed(1)}%)</div>
          <div><strong>Threat Lexicons:</strong> Urgency, Credentials, TLDs, Impersonation</div>
          <div><strong>Execution:</strong> Browser Client-Side Vector Engine</div>
        </div>

        {/* Sensitivity Option */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.375rem' }}>
            ML Threat Sensitivity
          </label>
          <select
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.5rem',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          >
            <option value="standard">Standard (Recommended - Balanced Precision & Recall)</option>
            <option value="high">High Sensitivity (Aggressive flag on unknown links)</option>
            <option value="relaxed">Relaxed (Strict confirmation required)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={handleOpenLab}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#4F46E5',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            🔬 Open Model Training & Evaluation Lab
          </button>

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#1E293B',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
