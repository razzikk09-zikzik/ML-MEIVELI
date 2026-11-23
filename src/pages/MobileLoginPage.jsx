import { supabase } from '../utils/supabase';
import { useLanguage } from '../context/LanguageContext';

export default function MobileLoginPage({ onGuestLogin }) {
  const { t, language, setLanguage } = useLanguage();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Fallback to guest mode if OAuth fails or isn't configured
      if (onGuestLogin) onGuestLogin();
    }
  };

  const handleGuest = () => {
    if (onGuestLogin) {
      onGuestLogin();
    } else {
      sessionStorage.setItem('MEYVIZHI_GUEST_USER', 'true');
      window.location.reload();
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      fontFamily: 'var(--font-body)'
    }}>
      {/* Top Bar for Language */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '1.25rem', padding: '0.125rem' }}>
          <button
            onClick={() => setLanguage('en')}
            style={{ padding: '0.375rem 0.625rem', borderRadius: '1rem', border: 'none', background: language === 'en' ? '#2563EB' : 'transparent', color: language === 'en' ? '#fff' : '#64748b', fontFamily: "var(--font-head)", fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}
          >EN</button>
          <button
            onClick={() => setLanguage('ta')}
            style={{ padding: '0.375rem 0.625rem', borderRadius: '1rem', border: 'none', background: language === 'ta' ? '#2563EB' : 'transparent', color: language === 'ta' ? '#fff' : '#64748b', fontFamily: "var(--font-tamil)", fontWeight: '500', fontSize: '0.75rem', cursor: 'pointer' }}
          >தமிழ்</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center' }}>
        <img src="/assets/logo.png" alt="Meyvizhi" style={{ height: '80px', marginBottom: '1.5rem' }} />
        
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
          Welcome to Meyvizhi
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9375rem', marginBottom: '2rem', lineHeight: 1.5, maxWidth: '20rem' }}>
          Autonomous ML-Powered Scam & Phishing Detection Platform.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '300px' }}>
          <button
            onClick={handleLogin}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              width: '100%', padding: '0.875rem', borderRadius: '2rem',
              border: '1px solid #E6EAF2', background: '#fff', color: '#0F172A',
              fontFamily: 'var(--font-head)', fontWeight: '700', fontSize: '0.9375rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer'
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Sign in with Google
          </button>

          <button
            onClick={handleGuest}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              width: '100%', padding: '0.875rem', borderRadius: '2rem',
              border: 'none', background: '#F1F5F9', color: '#334155',
              fontFamily: 'var(--font-head)', fontWeight: '700', fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            ⚡ Continue as Guest / Evaluator
          </button>
        </div>
      </div>
    </div>
  );
}
