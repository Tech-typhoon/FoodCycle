import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';

function AuthPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.();
    } catch (err) {
      const errorMessage = getFriendlyErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      onSuccess?.();
    } catch (err) {
      const errorMessage = getFriendlyErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess?.();
    } catch (err) {
      const errorMessage = getFriendlyErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address. Please check your email or sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authShell}>
        {/* LEFT PANEL */}
        <div style={styles.authLeft}>
          <div style={styles.leftLogo}>
            Food<span style={styles.logoSpan}>Cycle</span>
          </div>
          <div style={styles.leftBody}>
            <div style={styles.leftHeadline}>
              Reduce food waste, <em style={{ fontStyle: 'italic', color: '#EF9F27' }}>feed communities</em>
            </div>
            <div style={styles.leftDesc}>
              Join a community working together to redistribute surplus food and reduce waste while making a difference.
            </div>
            <div style={styles.statChips}>
              <div style={styles.statChip}>
                <div style={{ ...styles.chipIcon, background: '#639922' }}>🌿</div>
                <div style={styles.chipText}>
                  <span style={styles.chipVal}>10K+ kg</span> of food saved this month
                </div>
              </div>
              <div style={styles.statChip}>
                <div style={{ ...styles.chipIcon, background: '#EF9F27' }}>🏪</div>
                <div style={styles.chipText}>
                  <span style={styles.chipVal}>500+</span> active food providers
                </div>
              </div>
              <div style={styles.statChip}>
                <div style={{ ...styles.chipIcon, background: '#1D9E75' }}>🤝</div>
                <div style={styles.chipText}>
                  <span style={styles.chipVal}>200+</span> community organizations
                </div>
              </div>
            </div>
          </div>
          <div style={styles.leftFooter}>FoodCycle © 2026 · Food safety certified</div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.authRight}>
          <div style={styles.authToggle}>
            <button
              style={{
                ...styles.toggleBtn,
                ...(isLogin ? styles.toggleBtnActive : {}),
              }}
              onClick={() => setIsLogin(true)}
            >
              Sign in
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                ...(!isLogin ? styles.toggleBtnActive : {}),
              }}
              onClick={() => setIsLogin(false)}
            >
              Create account
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form style={styles.authForm} onSubmit={handleLogin}>
              <div style={styles.formHeading}>Welcome back</div>
              <div style={styles.formSubheading}>Sign in to list or claim food</div>

              {error && <div style={styles.errorMsg}>{error}</div>}

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.fieldInput}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.fieldInput}
                    required
                  />
                  <button
                    type="button"
                    style={styles.pwToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={styles.btnSubmit}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <div style={styles.divider}>
                <hr style={styles.dividerLine} />
                <span style={styles.dividerText}>or continue with</span>
                <hr style={styles.dividerLine} />
              </div>

              <button
                type="button"
                style={styles.socialBtn}
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg width="14" height="14" viewBox="0 0 18 18">
                  <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
                  <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/>
                  <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"/>
                  <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>
          ) : (
            <form style={styles.authForm} onSubmit={handleSignup}>
              <div style={styles.formHeading}>Join FoodCycle</div>
              <div style={styles.formSubheading}>Create your account and start reducing food waste</div>

              {error && <div style={styles.errorMsg}>{error}</div>}

              <div style={styles.fieldRow}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Full name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.fieldInput}
                    required
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.fieldInput}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Phone number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.fieldInput}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>I am joining as</label>
                <div style={styles.roleSelector}>
                  <div
                    style={{
                      ...styles.roleOpt,
                      ...(role === 'provider' ? styles.roleOptSelected : {}),
                    }}
                    onClick={() => setRole('provider')}
                  >
                    <span style={styles.roleIcon}>🏪</span>
                    <span style={styles.roleLabel}>Food Provider</span>
                  </div>
                  <div
                    style={{
                      ...styles.roleOpt,
                      ...(role === 'buyer' ? styles.roleOptSelected : {}),
                    }}
                    onClick={() => setRole('buyer')}
                  >
                    <span style={styles.roleIcon}>🙏</span>
                    <span style={styles.roleLabel}>Buyer/Recipient</span>
                  </div>
                  <div
                    style={{
                      ...styles.roleOpt,
                      ...(role === 'org' ? styles.roleOptSelected : {}),
                    }}
                    onClick={() => setRole('org')}
                  >
                    <span style={styles.roleIcon}>🏛️</span>
                    <span style={styles.roleLabel}>Organization</span>
                  </div>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>City / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Koramangala"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={styles.fieldInput}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.fieldInput}
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    style={styles.pwToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={styles.btnSubmit}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div style={styles.divider}>
                <hr style={styles.dividerLine} />
                <span style={styles.dividerText}>or sign up with</span>
                <hr style={styles.dividerLine} />
              </div>

              <button
                type="button"
                style={styles.socialBtn}
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg width="14" height="14" viewBox="0 0 18 18">
                  <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
                  <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/>
                  <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"/>
                  <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    background: '#f7f6f2',
  },
  authShell: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    maxWidth: '900px',
    width: '100%',
    background: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    minHeight: '620px',
  },
  authLeft: {
    background: '#3B6D11',
    padding: '44px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  leftLogo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    display: 'flex',
    gap: '6px',
  },
  logoSpan: {
    fontStyle: 'italic',
    fontWeight: '300',
    color: '#EF9F27',
  },
  leftBody: {
    position: 'relative',
    zIndex: '1',
  },
  leftHeadline: {
    fontSize: '28px',
    fontWeight: '500',
    color: '#fff',
    lineHeight: '1.25',
    marginBottom: '14px',
  },
  leftDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.7',
    marginBottom: '28px',
  },
  statChips: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '9px',
    padding: '10px 14px',
  },
  chipIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: '0',
  },
  chipText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.45',
  },
  chipVal: {
    fontWeight: '500',
    color: '#fff',
  },
  leftFooter: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
    position: 'relative',
    zIndex: '1',
  },
  authRight: {
    padding: '36px 40px',
    display: 'flex',
    flexDirection: 'column',
  },
  authToggle: {
    display: 'flex',
    background: '#f1efe8',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '28px',
    gap: '4px',
  },
  toggleBtn: {
    flex: '1',
    padding: '9px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    background: 'transparent',
    borderRadius: '7px',
    cursor: 'pointer',
    color: '#888780',
    transition: 'all 0.2s',
  },
  toggleBtnActive: {
    background: '#fff',
    color: '#2C2C2A',
    boxShadow: '0 1px 4px rgba(0,0,0,0.09)',
  },
  authForm: {
    display: 'block',
    animation: 'slideIn 0.22s ease',
  },
  formHeading: {
    fontSize: '22px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  formSubheading: {
    fontSize: '13px',
    color: '#5F5E5A',
    marginBottom: '22px',
  },
  errorMsg: {
    fontSize: '12px',
    color: '#A32D2D',
    background: '#FCEBEB',
    borderRadius: '7px',
    padding: '9px 13px',
    marginBottom: '12px',
    border: '0.5px solid #F7C1C1',
  },
  field: {
    marginBottom: '14px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '500',
    color: '#5F5E5A',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  fieldInput: {
    width: '100%',
    fontSize: '13px',
    padding: '10px 13px',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: '9px',
    background: '#fff',
    color: '#2C2C2A',
    outline: 'none',
    fontFamily: '"DM Sans", sans-serif',
    transition: 'border-color 0.15s',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  passwordWrap: {
    position: 'relative',
  },
  pwToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888780',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: '"DM Sans", sans-serif',
  },
  roleSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '14px',
  },
  roleOpt: {
    padding: '11px 6px',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: '9px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
  },
  roleOptSelected: {
    borderColor: '#639922',
    background: '#EAF3DE',
  },
  roleIcon: {
    fontSize: '20px',
    display: 'block',
    marginBottom: '4px',
  },
  roleLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#5F5E5A',
    display: 'block',
  },
  btnSubmit: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '9px',
    background: '#3B6D11',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.15s',
    marginBottom: '16px',
    fontFamily: '"DM Sans", sans-serif',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  dividerLine: {
    flex: '1',
    border: 'none',
    borderTop: '0.5px solid rgba(0,0,0,0.1)',
  },
  dividerText: {
    fontSize: '11px',
    color: '#5F5E5A',
    whiteSpace: 'nowrap',
  },
  socialBtn: {
    width: '100%',
    padding: '9px 6px',
    fontSize: '12px',
    fontWeight: '500',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: '9px',
    background: 'transparent',
    cursor: 'pointer',
    color: '#2C2C2A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background 0.15s',
    fontFamily: '"DM Sans", sans-serif',
  },
};

export default AuthPage;
