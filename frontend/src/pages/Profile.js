// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import api from '../services/api';
// import './Profile.css';

// const Profile = () => {
//   const { user, logout, login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         ...formData,
//         name: user.name || '',
//         email: user.email || ''
//       });
//     } else {
//       navigate('/login');
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setError('');

//     // Validate passwords match
//     if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
//       setError('New passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const updateData = {
//         name: formData.name,
//         email: formData.email
//       };

//       if (formData.currentPassword && formData.newPassword) {
//         updateData.currentPassword = formData.currentPassword;
//         updateData.newPassword = formData.newPassword;
//       }

//       const { data } = await api.put('/auth/profile', updateData);
      
//       // Update auth context with new user data
//       const { data: loginData } = await api.post('/auth/login', {
//         email: formData.email,
//         password: formData.currentPassword || 'dummy'
//       });
      
//       localStorage.setItem('token', loginData.token);
//       await login(loginData.email, formData.currentPassword || 'dummy');
      
//       setMessage('Profile updated successfully!');
      
//       // Clear password fields
//       setFormData({
//         ...formData,
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
      
//       setTimeout(() => {
//         setMessage('');
//       }, 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (!user) {
//     return null;
//   }

//   const isInstructor = user.role === 'instructor';

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <div className="profile-header">
//           <div className="profile-avatar-large">
//             {user.name?.charAt(0) || 'U'}
//           </div>
//           <h1>Profile Settings</h1>
//           <p className="profile-role">{isInstructor ? '👨‍🏫 Instructor' : '🎓 Student'}</p>
//         </div>

//         {message && <div className="success-message">{message}</div>}
//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="profile-form">
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter your full name"
//             />
//           </div>

//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="password-section">
//             <h3>Change Password</h3>
//             <p className="section-hint">Leave blank if you don't want to change password</p>
            
//             <div className="form-group">
//               <label>Current Password</label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 value={formData.currentPassword}
//                 onChange={handleChange}
//                 placeholder="Enter current password"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>New Password</label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   placeholder="Enter new password"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Confirm New Password</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm new password"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="submit" className="save-btn" disabled={loading}>
//               {loading ? 'Saving...' : 'Update Profile'}
//             </button>
//           </div>
//         </form>

//         <div className="profile-info">
//           <h3>Account Information</h3>
//           <div className="info-row">
//             <span className="info-label">Member Since:</span>
//             <span className="info-value">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
//           </div>
//           <div className="info-row">
//             <span className="info-label">Account Type:</span>
//             <span className="info-value">{isInstructor ? 'Instructor Account' : 'Student Account'}</span>
//           </div>
//           <div className="info-row">
//             <span className="info-label">User ID:</span>
//             <span className="info-value">{user._id}</span>
//           </div>
//         </div>

//         <div className="logout-section">
//           <button 
//             className="logout-btn"
//             onClick={() => setShowLogoutConfirm(true)}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
//           <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
//             <h3>Confirm Logout</h3>
//             <p>Are you sure you want to logout?</p>
//             <div className="modal-actions">
//               <button className="confirm-logout-btn" onClick={handleLogout}>
//                 Yes, Logout
//               </button>
//               <button className="cancel-logout-btn" onClick={() => setShowLogoutConfirm(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;













































import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    } else {
      navigate('/login');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await api.put('/auth/profile', updateData);

      const { data: loginData } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.currentPassword || 'dummy'
      });
      localStorage.setItem('token', loginData.token);
      await login(loginData.email, formData.currentPassword || 'dummy');

      setMessage('Profile updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isInstructor = user.role === 'instructor';

  return (
    <div className="profile-page">
      <div className="profile-wrap">

        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="sidebar-top">
            <div className="avatar-ring">{user.name?.charAt(0) || 'U'}</div>
            <div className="sidebar-name">{user.name}</div>
            <div className="sidebar-email">{user.email}</div>
            <span className="role-badge">
              {isInstructor ? '👨‍🏫 Instructor' : '🎓 Student'}
            </span>
          </div>

          <div className="sidebar-info">
            <div className="info-row">
              <span className="info-label">Member since</span>
              <span className="info-value">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Account type</span>
              <span className="info-value">
                {isInstructor ? 'Instructor' : 'Student'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">User ID</span>
              <span className="info-value info-id">{user._id}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
            Sign out
          </button>
        </aside>

        {/* ── Main ── */}
        <main className="profile-main">
          {message && <div className="alert alert-success">{message}</div>}
          {error   && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="section-card">
              <h2 className="section-title">Personal information</h2>

              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <input id="name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  required placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  required placeholder="Enter your email" />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving…' : 'Update profile'}
                </button>
              </div>
            </div>

            <div className="section-card">
              <h2 className="section-title">Change password</h2>
              <p className="section-hint">Leave blank if you don't want to change your password.</p>

              <div className="form-group">
                <label htmlFor="currentPassword">Current password</label>
                <input id="currentPassword" type="password" name="currentPassword"
                  value={formData.currentPassword} onChange={handleChange}
                  placeholder="Enter current password" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newPassword">New password</label>
                  <input id="newPassword" type="password" name="newPassword"
                    value={formData.newPassword} onChange={handleChange}
                    placeholder="New password" />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input id="confirmPassword" type="password" name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Confirm new password" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving…' : 'Update password'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* ── Logout modal ── */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Sign out?</h3>
            <p>You'll need to log in again to access your account.</p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={handleLogout}>Yes, sign out</button>
              <button className="btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;