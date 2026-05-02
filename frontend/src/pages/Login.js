// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">Welcome Back!</h2>
//         <p className="login-subtitle">Login to continue your learning journey</p>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit} className="login-form">
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
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Enter your password"
//             />
//           </div>
          
//           <button type="submit" className="login-btn">
//             Login
//           </button>
//         </form>
        
//         <p className="register-link">
//           Don't have an account? <Link to="/register">Register here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;















import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-left">
        <div className="lg-brand">
          <div className="lg-brand-dot" />
          LearnHub
        </div>
        <div className="lg-left-body">
          <h1 className="lg-headline">Learn without limits.</h1>
          <p className="lg-tagline">
            Join thousands of learners building real skills with expert-led courses.
          </p>
          <div className="lg-testimonial">
            <div className="lg-testimonial-text">
              "LearnHub completely changed how I approach learning. I went from zero to landing my first dev job in 6 months."
            </div>
            <div className="lg-testimonial-author">
              <div className="lg-author-avatar">RK</div>
              <div>
                <div className="lg-author-name">Rahul K.</div>
                <div className="lg-author-role">Frontend Developer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg-right">
        <div className="lg-card">
          <h2 className="lg-title">Welcome back</h2>
          <p className="lg-subtitle">Sign in to continue your learning journey</p>

          {error && (
            <div className="lg-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lg-form">
            <div className="lg-field">
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

            <div className="lg-field">
              <div className="lg-field-header">
                <label htmlFor="password">Password</label>
                <a href="#" className="lg-forgot">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="lg-submit-btn" disabled={loading}>
              {loading
                ? <><svg className="lg-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg> Signing in…</>
                : 'Sign in'
              }
            </button>
          </form>

          <p className="lg-register-link">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;