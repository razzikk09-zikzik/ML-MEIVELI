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
      padding: '2rem 1rem',
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        padding: '2.5rem',
        maxWidth: '32rem',
        width: '100%',
        textAlign: 'center',
        border: '1px solid #E6EAF2'
      }}>
        {/* Top Icon: Meiveli Logo */}
        <div style={{
          width: '4.25rem',
          height: '4.25rem',
          background: '#EEF2FF',
          borderRadius: '1.125rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: '1px solid #E0E7FF'
        }}>
          <img
            src="/assets/eye-mark.png"
            alt="Meiveli"
            style={{ width: '2.75rem', height: '2.75rem', objectFit: 'contain' }}
          />
        </div>
        
        {/* Header Prompt */}
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.75rem' }}>
          Please use your phone
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.55', marginBottom: '2rem' }}>
          MEYVIZHI is designed as a mobile-first experience. Please visit this site on your smartphone to report and analyze scams.
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #E2E8F0', margin: '1.75rem 0' }}></div>

        {/* Analyst Section */}
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.125rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>
          Are you an Analyst?
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          Access the secure portal to review verified threats and community reports.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '0.875rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: '#0F172A',
              color: '#fff',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Access Analyst Dashboard
          </button>

          <button
            onClick={() => navigate('/ml-lab')}
            style={{
              width: '100%',
              padding: '0.875rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1.5px solid #2563EB',
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontFamily: 'var(--font-head)',
              fontWeight: '700',
              fontSize: '0.9375rem',
              cursor: 'pointer'
            }}
          >
            🔬 Launch ML Model Lab & Inspector
          </button>
        </div>

        {/* Academic Project & Student Credentials */}
        <div style={{
          borderTop: '1px solid #E2E8F0',
          paddingTop: '1.25rem',
          textAlign: 'left',
          background: '#F8FAFC',
          borderRadius: '0.875rem',
          padding: '1rem',
          border: '1px solid #E2E8F0'
        }}>
          {/* College Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem', paddingBottom: '0.625rem', borderBottom: '1px solid #E2E8F0' }}>
            <img
              src="/assets/crescent_logo.png"
              alt="Crescent Logo"
              style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '0.8125rem', color: '#0F172A', lineHeight: 1.25 }}>
                B. S. Abdur Rahman Crescent Institute
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Institute Of Science And Technology • B.Tech E and CE (5th Sem) • ESDX 041
              </div>
            </div>
          </div>

          {/* Student Names & Register Numbers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>Mohammed Razik K</span>
              <span style={{ color: '#64748B', fontFamily: 'monospace', fontWeight: '600' }}>240201601062</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>Adhithiyan RRN</span>
              <span style={{ color: '#64748B', fontFamily: 'monospace', fontWeight: '600' }}>240201601006</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>Gautham Balaji</span>
              <span style={{ color: '#64748B', fontFamily: 'monospace', fontWeight: '600' }}>240201601022</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
