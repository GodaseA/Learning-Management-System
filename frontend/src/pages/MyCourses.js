// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import api from '../services/api';
// import './MyCourses.css';

// const MyCourses = () => {
//   const { user } = useContext(AuthContext);
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user && user._id) {
//       fetchMyCourses();
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   const fetchMyCourses = async () => {
//     try {
//       console.log('Fetching courses for student:', user._id);
//       const response = await api.get(`/enrollments/my-courses?studentId=${user._id}`);
//       console.log('Response:', response.data);
//       setEnrollments(response.data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       if (error.response) {
//         console.error('Server response:', error.response.data);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="my-courses">
//         <div className="login-prompt">
//           <h2>Please Login to View Your Dashboard</h2>
//           <Link to="/login">Login Now</Link>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return <div className="loading">Loading your courses...</div>;
//   }

//   return (
//     <div className="my-courses">
//       <div className="profile-header">
//         <div className="profile-avatar">
//           {user.name?.charAt(0) || 'S'}
//         </div>
//         <div className="profile-info">
//           <h1>{user.name}</h1>
//           <p>{user.email}</p>
//           <span className="student-badge">Student</span>
//         </div>
//       </div>

//       <div className="courses-section">
//         <h2>My Enrolled Courses ({enrollments.length})</h2>
        
//         {enrollments.length === 0 ? (
//           <div className="no-courses">
//             <p>You haven't enrolled in any courses yet.</p>
//             <Link to="/courses">Browse Courses</Link>
//           </div>
//         ) : (
//           <div className="enrollments-grid">
//             {enrollments.map((enrollment) => (
//               <div key={enrollment._id} className="enrollment-card">
//                 <img 
//                   src={enrollment.course?.thumbnail || 'https://picsum.photos/seed/' + enrollment.course?._id + '/300/200'} 
//                   alt={enrollment.course?.title}
//                   className="course-image"
//                   onError={(e) => {
//                     e.target.src = 'https://picsum.photos/seed/fallback/300/200';
//                   }}
//                 />
//                 <div className="course-details">
//                   <h3>{enrollment.course?.title}</h3>
//                   <p>{enrollment.course?.description?.substring(0, 100)}</p>
//                   <div className="progress-section">
//                     <div className="progress-bar">
//                       <div 
//                         className="progress-fill" 
//                         style={{ width: `${enrollment.progress || 0}%` }}
//                       ></div>
//                     </div>
//                     <span>{Math.round(enrollment.progress || 0)}% Complete</span>
//                   </div>
//                   <Link to={`/course/${enrollment.course?._id}`} className="continue-btn">
//                     Continue Learning
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyCourses;






























import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Play } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import './MyCourses.css';

const MyCourses = () => {
  const { user }                          = useContext(AuthContext);
  const [enrollments, setEnrollments]     = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    if (user?._id) fetchMyCourses();
    else setLoading(false);
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      const { data } = await api.get(`/enrollments/my-courses?studentId=${user._id}`);
      setEnrollments(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  const totalProgress = enrollments.length
    ? Math.round(enrollments.reduce((a, e) => a + (e.progress || 0), 0) / enrollments.length)
    : 0;
  const completed = enrollments.filter(e => Math.round(e.progress || 0) === 100).length;

  /* ── Not logged in ── */
  if (!user) return (
    <div className="mc-page">
      <div className="mc-gate">
        <div className="mc-gate-icon"><BookOpen size={24} /></div>
        <h2>Sign in to see your courses</h2>
        <p>Track your progress and pick up right where you left off.</p>
        <Link to="/login" className="mc-cta-btn">Sign in</Link>
      </div>
    </div>
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="mc-loading">
      <svg className="mc-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Loading your courses…
    </div>
  );

  return (
    <div className="mc-page">

      {/* ── Profile header ── */}
      <div className="mc-hero">
        <div className="mc-hero-inner">
          <div className="mc-avatar">{initials}</div>
          <div className="mc-profile-info">
            <div className="mc-eyebrow">Student dashboard</div>
            <h1 className="mc-name">{user.name}</h1>
            <p className="mc-email">{user.email}</p>
          </div>
          <div className="mc-hero-stats">
            <div className="mc-hstat">
              <div className="mc-hstat-num">{enrollments.length}</div>
              <div className="mc-hstat-label">Enrolled</div>
            </div>
            <div className="mc-hstat">
              <div className="mc-hstat-num">{completed}</div>
              <div className="mc-hstat-label">Completed</div>
            </div>
            <div className="mc-hstat">
              <div className="mc-hstat-num">{totalProgress}%</div>
              <div className="mc-hstat-label">Avg progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Courses ── */}
      <div className="mc-body">
        <div className="mc-sec-header">
          <h2 className="mc-sec-title">My courses ({enrollments.length})</h2>
          <Link to="/courses" className="mc-browse-link">
            Browse more <ArrowRight size={12} />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="mc-empty">
            <BookOpen size={30} color="#b4b2a9" />
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="mc-cta-btn">Browse courses</Link>
          </div>
        ) : (
          <div className="mc-grid">
            {enrollments.map(enrollment => {
              const course   = enrollment.course;
              const progress = Math.round(enrollment.progress || 0);
              const done     = progress === 100;
              const thumb    = course?.thumbnail
                || `https://picsum.photos/seed/${course?._id}/600/400`;

              return (
                <div key={enrollment._id} className="mc-card">
                  <div className="mc-card-img-wrap">
                    <img
                      src={thumb}
                      alt={course?.title}
                      className="mc-card-img"
                      onError={e => { e.target.src = 'https://picsum.photos/seed/fallback/600/400'; }}
                    />
                    {done && <div className="mc-done-overlay">Completed</div>}
                  </div>

                  <div className="mc-card-body">
                    {course?.category && (
                      <span className="mc-tag">{course.category}</span>
                    )}
                    <h3 className="mc-card-title">{course?.title}</h3>
                    <p className="mc-card-desc">
                      {course?.description?.substring(0, 90)}
                      {course?.description?.length > 90 ? '…' : ''}
                    </p>

                    <div className="mc-progress-section">
                      <div className="mc-progress-bar-wrap">
                        <div
                          className="mc-progress-bar-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mc-progress-label">
                        <span>{done ? 'Complete' : `${progress}% done`}</span>
                        {!done && <span>{100 - progress}% left</span>}
                      </div>
                    </div>

                    <Link
                      to={`/course/${course?._id}`}
                      className={`mc-continue-btn ${done ? 'mc-continue-done' : ''}`}
                    >
                      {done
                        ? <><BookOpen size={13} /> Review course</>
                        : <><Play size={12} fill="currentColor" /> Continue learning</>
                      }
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;