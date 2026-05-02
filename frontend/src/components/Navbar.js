// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import './Navbar.css';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         <Link to="/" className="nav-logo">
//           📚 LearnHub LMS
//         </Link>
        
//         <div className="nav-menu">
//           <Link to="/courses" className="nav-link">Courses</Link>
          
//           {/* Show My Courses only for students */}
//           {user && user.role === 'student' && (
//             <Link to="/my-courses" className="nav-link">My Courses</Link>
//           )}
          
//           {/* Show Instructor Dashboard only for instructors */}
//           {user && user.role === 'instructor' && (
//             <Link to="/instructor/dashboard" className="nav-link">Instructor Dashboard</Link>
//           )}
          
//           {user ? (
//             <>
//               <Link to="/profile" className="nav-link profile-nav-link">
//                 👤 Profile
//               </Link>
//               <button onClick={handleLogout} className="logout-nav-btn">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="nav-link">Login</Link>
//               <Link to="/register" className="nav-link register-btn">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



















import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="nav-logo">
          LearnHub<span className="logo-dot" />
        </Link>

        <div className="nav-menu">
          <Link to="/courses" className="nav-link">Courses</Link>

          {user?.role === 'student' && (
            <Link to="/my-courses" className="nav-link">My courses</Link>
          )}

          {user?.role === 'instructor' && (
            <Link to="/instructor/dashboard" className="nav-link">Dashboard</Link>
          )}

          {user ? (
            <>
              <span className="nav-divider" />
              <Link to="/profile" className="avatar-btn">
                <span className="avatar-circle">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                {user.name?.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="logout-nav-btn">
                Sign out
              </button>
            </>
          ) : (
            <>
              <span className="nav-divider" />
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;