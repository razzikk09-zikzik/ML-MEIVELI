import { useNavigate } from 'react-router-dom';

export default function DesktopGateway() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        padding: '2.5rem',
        maxWidth: '36rem',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '4rem', height: '4rem', background: '#EEF2FF', borderRadius: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
        }}>
          <span style={{ fontSize: '2rem' }}>🧠</span>
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
          Meiveli-NGEM Intelligence Gateway
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.5', marginBottom: '2rem' }}>
          Autonomous Machine Learning Phishing, Urgency & Cyber Threat Detection System. Designed for high-speed citizen safety and analyst defense.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534' }}>Zero External API</div>
            <div style={{ fontSize: '0.8125rem', color: '#15803D' }}>Self-contained local ML inference</div>
          </div>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1E40AF' }}>NLP & Urgency Scoring</div>
            <div style={{ fontSize: '0.8125rem', color: '#1D4ED8' }}>Time coercion & panic trigger detection</div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/ml-lab')}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: '#2563EB',
              color: '#fff',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
            }}
          >
            🔬 Launch ML Model Lab & Inspector (Assignment Review)
          </button>

          <button
            onClick={() => {
              sessionStorage.setItem('FORCE_MOBILE_VIEW', 'true');
              window.location.href = '/?preview=citizen';
            }}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              border: '1px solid #CBD5E1',
              background: '#fff',
              color: '#0F172A',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            📱 Open Citizen Safety App (Web Preview)
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: '#0F172A',
              color: '#fff',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer'
            }}
          >
            🛡️ Access Analyst Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
