// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import './Register.css';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState('student');
//   const [error, setError] = useState('');
//   const { register } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
//     try {
//       await register(name, email, password, role);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="register-box">
//         <h2 className="register-title">Create Account</h2>
//         <p className="register-subtitle">Join our learning community today</p>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit} className="register-form">
//           <div className="form-group">
//             <label htmlFor="name">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               placeholder="Enter your full name"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter your email"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="role">I want to</label>
//             <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="student">Learn as a Student</option>
//               <option value="instructor">Teach as an Instructor</option>
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Create a password"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               placeholder="Confirm your password"
//             />
//           </div>
          
//           <button type="submit" className="register-btn">
//             Create Account
//           </button>
//         </form>
        
//         <p className="login-link">
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;






















import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]                     = useState('student');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const { register }                        = useContext(AuthContext);
  const navigate                            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">

      {/* ── Left panel ── */}
      <div className="rg-left">
        <div className="rg-brand">
          <div className="rg-brand-dot" />
          LearnHub
        </div>
        <div className="rg-left-body">
          <h1 className="rg-headline">Your journey starts here.</h1>
          <p className="rg-tagline">
            Whether you want to learn a new skill or share your expertise — LearnHub has a place for you.
          </p>
          <div className="rg-perks">
            {[
              ['Access 1,200+ expert-led courses', 'Free and paid options available'],
              ['Learn at your own pace',            'On any device, anytime'],
              ['Earn recognised certificates',      'Showcase your achievements'],
              ['Join a global community',           '48,000+ active learners'],
            ].map(([title, sub]) => (
              <div key={title} className="rg-perk">
                <div className="rg-perk-check">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div className="rg-perk-title">{title}</div>
                  <div className="rg-perk-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="rg-right">
        <div className="rg-card">
          <h2 className="rg-title">Create your account</h2>
          <p className="rg-subtitle">Join thousands of learners and instructors today</p>

          {error && (
            <div className="rg-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Role toggle */}
          <div className="rg-role-toggle">
            <button
              type="button"
              className={`rg-role-btn ${role === 'student' ? 'rg-role-active' : ''}`}
              onClick={() => setRole('student')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Learn as student
            </button>
            <button
              type="button"
              className={`rg-role-btn ${role === 'instructor' ? 'rg-role-active' : ''}`}
              onClick={() => setRole('instructor')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              Teach as instructor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="rg-form">
            <div className="rg-field">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                autoComplete="name"
              />
            </div>

            <div className="rg-field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="rg-field-row">
              <div className="rg-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="rg-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="rg-submit-btn" disabled={loading}>
              {loading
                ? <><svg className="rg-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg> Creating account…</>
                : `Create ${role === 'instructor' ? 'instructor' : 'student'} account`
              }
            </button>
          </form>

          <p className="rg-login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;