import { useNavigate } from 'react-router-dom';

export default function DesktopGateway() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(100% 100% at 50% 0%, #EEF5FF 0%, #F8FAFC 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.75rem',
        boxShadow: '0 20px 35px -5px rgba(15, 23, 42, 0.06), 0 8px 16px -6px rgba(15, 23, 42, 0.02)',
        border: '1px solid #E6EDF5',
        padding: '2.5rem',
        maxWidth: '44rem',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Top Logo (Meiveli Eye Mark) */}
        <div style={{
          width: '4.5rem',
          height: '4.5rem',
          background: '#F0F6FF',
          borderRadius: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '1px solid #DBEAFE',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.1)'
        }}>
          <img src="/assets/eye-mark.png" alt="Meiveli Logo" style={{ width: '2.85rem', height: '2.85rem', objectFit: 'contain' }} />
        </div>
        
        {/* Title & Subtitle */}
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.875rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Meiveli-NGEM Intelligence Gateway
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.5', marginBottom: '1.75rem' }}>
          Autonomous Machine Learning Phishing, Urgency & Cyber Threat Detection System.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.875rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', fontSize: '1.125rem', flexShrink: 0 }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#166534' }}>Zero External API</div>
              <div style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '0.125rem' }}>Self-contained local ML inference</div>
            </div>
          </div>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.875rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: '1.125rem', flexShrink: 0 }}>
              <img src="/assets/eye-mark.png" alt="NLP" style={{ width: '1.35rem', height: '1.35rem', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#1E40AF' }}>NLP & Urgency Scoring</div>
              <div style={{ fontSize: '0.75rem', color: '#1D4ED8', marginTop: '0.125rem' }}>Time coercion & panic trigger detection</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {/* Button 1: Launch ML Lab */}
          <button
            onClick={() => navigate('/ml-lab')}
            style={{
              width: '100%',
              padding: '0.9375rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: '#1D6FF2',
              color: '#fff',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(29, 111, 242, 0.25)',
              transition: 'transform 0.15s, background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#185ecc'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1D6FF2'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
                <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
              </svg>
              <span>Launch ML Model Lab & Inspector (Assignment Review)</span>
            </div>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>→</span>
          </button>

          {/* Button 2: Citizen Safety App */}
          <button
            onClick={() => {
              sessionStorage.setItem('FORCE_MOBILE_VIEW', 'true');
              window.location.href = '/?preview=citizen';
            }}
            style={{
              width: '100%',
              padding: '0.9375rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1.5px solid #E2E8F0',
              background: '#fff',
              color: '#0F172A',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 0.15s, background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Open Citizen Safety App (Web Preview)</span>
            </div>
            <span style={{ fontSize: '1.25rem', color: '#64748B', lineHeight: 1 }}>→</span>
          </button>

          {/* Button 3: Analyst Dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '0.9375rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1.5px solid #E2E8F0',
              background: '#fff',
              color: '#0F172A',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 0.15s, background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Access Analyst Dashboard</span>
            </div>
            <span style={{ fontSize: '1.25rem', color: '#64748B', lineHeight: 1 }}>→</span>
          </button>
        </div>

        {/* Academic Project & Student Credentials Card (Matching Attached Mockup) */}
        <div style={{
          borderTop: '1px solid #E6EDF5',
          paddingTop: '1.5rem',
          textAlign: 'left'
        }}>
          {/* College Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="/assets/crescent_logo.png"
                alt="Crescent Logo"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '0.875rem', color: '#0F172A', lineHeight: 1.3 }}>
                  B. S. Abdur Rahman Crescent
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: '700', fontSize: '0.8125rem', color: '#475569' }}>
                  Institute Of Science And Technology
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #DBEAFE' }}>
                B.Tech E and CE
              </span>
              <span style={{ color: '#CBD5E1', fontSize: '0.875rem' }}>|</span>
              <span style={{ background: '#F8FAFC', color: '#334155', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #E2E8F0' }}>
                5th Semester
              </span>
              <span style={{ color: '#CBD5E1', fontSize: '0.875rem' }}>|</span>
              <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '800', border: '1px solid #E0E7FF' }}>
                ESDX 041
              </span>
            </div>
          </div>

          {/* Student Names & Roll Numbers (3 Columns) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
            gap: '0.75rem',
            paddingTop: '1rem'
          }}>
            {/* Student 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '0.8125rem', color: '#0F172A' }}>Mohammed Razik K</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace', fontWeight: '600' }}>240201601062</div>
              </div>
            </div>

            {/* Student 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', borderLeft: '1px solid #F1F5F9', paddingLeft: '0.75rem' }}>
              <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '0.8125rem', color: '#0F172A' }}>Adhithiyan RRN</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace', fontWeight: '600' }}>240201601006</div>
              </div>
            </div>

            {/* Student 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', borderLeft: '1px solid #F1F5F9', paddingLeft: '0.75rem' }}>
              <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '0.8125rem', color: '#0F172A' }}>Gautham Balaji</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace', fontWeight: '600' }}>240201601022</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
