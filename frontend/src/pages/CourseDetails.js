// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import api from '../services/api';
// import './CourseDetails.css';

// const CourseDetails = () => {
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [enrolled, setEnrolled] = useState(false);
//   const [enrolling, setEnrolling] = useState(false);
//   const [enrollment, setEnrollment] = useState(null);

//   const isInstructor = user?.role === 'instructor';
//   const isStudent = user?.role === 'student';

//   useEffect(() => {
//     fetchCourse();
//     if (user && isStudent) {
//       checkEnrollment();
//     }
//   }, [id, user]);

//   const fetchCourse = async () => {
//     try {
//       const { data } = await api.get(`/courses/${id}`);
//       setCourse(data);
//     } catch (error) {
//       console.error('Error fetching course:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkEnrollment = async () => {
//     try {
//       const { data } = await api.get(`/enrollments/check/${id}?studentId=${user._id}`);
//       setEnrolled(data.enrolled);
//       setEnrollment(data.enrollment);
//       console.log('Enrollment status:', data);
//     } catch (error) {
//       console.error('Error checking enrollment:', error);
//       setEnrolled(false);
//     }
//   };

//   const handleEnroll = async () => {
//     if (!user) {
//       navigate('/login', { state: { from: `/course/${id}` } });
//       return;
//     }
    
//     setEnrolling(true);
//     try {
//       const response = await api.post(`/enrollments/${id}`, { studentId: user._id });
//       console.log('Enrollment response:', response.data);
//       setEnrolled(true);
//       alert('✨ Successfully enrolled in the course!');
//       await checkEnrollment();
//     } catch (error) {
//       console.error('Error enrolling:', error);
//       if (error.response?.status === 400) {
//         alert('You are already enrolled in this course!');
//       } else if (error.response?.status === 404) {
//         alert('Course not found or API endpoint incorrect');
//       } else {
//         alert('Failed to enroll. Please try again.');
//       }
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const handleStartLearning = () => {
//     if (course?.lessons && course.lessons.length > 0) {
//       navigate(`/course/${course._id}/lesson/${course.lessons[0]._id}`);
//     } else {
//       alert('No lessons available yet. Check back soon!');
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading course details...</div>;
//   }

//   if (!course) {
//     return <div className="error">Course not found</div>;
//   }

//   return (
//     <div className="course-details">
//       <div className="course-hero">
//         <img src={course.thumbnail || 'https://picsum.photos/seed/' + course._id + '/1200/400'} alt={course.title} className="course-banner" />
//         <div className="course-hero-content">
//           <h1>{course.title}</h1>
//           <p className="instructor">By {course.instructor?.name || 'Expert Instructor'}</p>
//           <div className="course-stats">
//             <span className="stat">{course.level}</span>
//             <span className="stat">Time: {course.duration} hours</span>
//             <span className="stat">Lessons: {course.lessons?.length || 0}</span>
//             <span className="stat">Students: {course.studentsEnrolled?.length || 0}</span>
//           </div>
          
//           <div className="price-section">
//             <div className="price-container">
//               <span className="price-label">Course Price</span>
//               <span className="price-value">
//                 {course.price === 0 ? 'FREE' : 'USD ' + course.price}
//               </span>
//             </div>
            
//             {isStudent && (
//               <>
//                 {!enrolled ? (
//                   <button 
//                     className={`enroll-btn ${enrolling ? 'enrolling' : ''}`} 
//                     onClick={handleEnroll}
//                     disabled={enrolling}
//                   >
//                     {enrolling ? 'Enrolling...' : 'Enroll Now'}
//                   </button>
//                 ) : (
//                   <div className="enrolled-section">
//                     <button className="start-learning-btn" onClick={handleStartLearning}>
//                       Start Learning Now →
//                     </button>
//                     {enrollment && (
//                       <div className="progress-info">
//                         <span>Progress: {Math.round(enrollment.progress || 0)}% complete</span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
            
//             {isInstructor && (
//               <button 
//                 className="edit-course-btn"
//                 onClick={() => navigate('/instructor/dashboard')}
//               >
//                 Edit Course
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="course-content">
//         <div className="course-description">
//           <h2>Course Description</h2>
//           <p>{course.description}</p>
//         </div>

//         {course.lessons && course.lessons.length > 0 && (
//           <div className="course-curriculum">
//             <h2>Course Curriculum ({course.lessons.length} lessons)</h2>
//             <div className="lessons-list">
//               {course.lessons.map((lesson, index) => (
//                 <div key={lesson._id} className="lesson-item">
//                   <div className="lesson-left">
//                     <span className="lesson-number">{index + 1}</span>
//                     <span className="lesson-icon">▶</span>
//                   </div>
//                   <div className="lesson-info">
//                     <h4>{lesson.title}</h4>
//                     <p>{lesson.description}</p>
//                   </div>
//                   <div className="lesson-right">
//                     <span className="lesson-duration">{lesson.duration} min</span>
//                     {isStudent && enrolled && (
//                       <button 
//                         className="watch-btn"
//                         onClick={() => navigate(`/course/${course._id}/lesson/${lesson._id}`)}
//                       >
//                         Watch
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {isStudent && !enrolled && (
//           <div className="enrollment-cta">
//             <h3>Ready to start your learning journey?</h3>
//             <p>Enroll now to get access to all {course.lessons?.length || 0} lessons</p>
//             <button className="cta-enroll-btn" onClick={handleEnroll}>
//               Enroll for {course.price === 0 ? 'FREE' : 'USD ' + course.price}
//             </button>
//           </div>
//         )}
        
//         {isInstructor && (
//           <div className="instructor-message">
//             <h3>Instructor View</h3>
//             <p>You are viewing this course as an instructor.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetails;

























import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import './CourseDetails.css';

import { FiClock, FiUsers, FiBook, FiZap, FiPlay, FiCheckCircle,
         FiEdit2, FiArrowRight, FiAward, FiSmartphone, FiLoader } from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollment, setEnrollment] = useState(null);

  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';

  useEffect(() => {
    fetchCourse();
    if (user && isStudent) checkEnrollment();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data } = await api.get(`/enrollments/check/${id}?studentId=${user._id}`);
      setEnrolled(data.enrolled);
      setEnrollment(data.enrollment);
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/course/${id}` } });
      return;
    }
    setEnrolling(true);
    try {
      const response = await api.post(`/enrollments/${id}`, { studentId: user._id });
      setEnrolled(true);
      alert('✨ Successfully enrolled in the course!');
      await checkEnrollment();
    } catch (error) {
      console.error('Error enrolling:', error);
      if (error.response?.status === 400) alert('You are already enrolled in this course!');
      else if (error.response?.status === 404) alert('Course not found or API endpoint incorrect');
      else alert('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (course?.lessons?.length > 0) {
      navigate(`/course/${course._id}/lesson/${course.lessons[0]._id}`);
    } else {
      alert('No lessons available yet. Check back soon!');
    }
  };

  if (loading) {
    return (
      <div className="cd-loading">
        <FiLoader className="cd-spinner" />
        <span>Loading course...</span>
      </div>
    );
  }

  if (!course) {
    return <div className="cd-error">Course not found</div>;
  }

  const progress = Math.round(enrollment?.progress || 0);

  return (
    <div className="cd-page">

      {/* ── Hero ── */}
      <div className="cd-hero">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id}/1200/400`}
          alt={course.title}
          className="cd-banner"
        />
        <div className="cd-hero-overlay">
          <div className="cd-breadcrumb">Courses / {course.category || 'General'}</div>
          <h1 className="cd-title">{course.title}</h1>
          <div className="cd-instructor">
            <span className="cd-instructor-dot">
              {course.instructor?.name?.charAt(0) || 'I'}
            </span>
            By {course.instructor?.name || 'Expert Instructor'}
          </div>
          <div className="cd-stats">
            <span className="cd-stat"><FiZap size={12} /> {course.level}</span>
            <span className="cd-stat"><FiClock size={12} /> {course.duration} hours</span>
            <span className="cd-stat"><FiBook size={12} /> {course.lessons?.length || 0} lessons</span>
            <span className="cd-stat"><FiUsers size={12} /> {course.studentsEnrolled?.length || 0} students</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="cd-body">

        {/* Left */}
        <div className="cd-left">

          <div className="cd-card">
            <h2 className="cd-section-title">
              <HiOutlineAcademicCap size={18} /> About this course
            </h2>
            <p className="cd-desc">{course.description}</p>
          </div>

          {course.lessons?.length > 0 && (
            <div className="cd-card">
              <h2 className="cd-section-title">
                <FiBook size={16} /> Course curriculum · {course.lessons.length} lessons
              </h2>
              <div className="lessons-list">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson._id} className="lesson-item">
                    <span className="lesson-num">{index + 1}</span>
                    <button
                      className="lesson-play"
                      onClick={() => isStudent && enrolled && navigate(`/course/${course._id}/lesson/${lesson._id}`)}
                      aria-label={`Play ${lesson.title}`}
                    >
                      <FiPlay size={11} fill="#fff" color="#fff" />
                    </button>
                    <div className="lesson-info">
                      <h4>{lesson.title}</h4>
                      <p>{lesson.description}</p>
                    </div>
                    <div className="lesson-right">
                      <span className="lesson-dur">
                        <FiClock size={11} /> {lesson.duration} min
                      </span>
                      {isStudent && enrolled && (
                        <button
                          className="watch-btn"
                          onClick={() => navigate(`/course/${course._id}/lesson/${lesson._id}`)}
                        >
                          Watch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isStudent && !enrolled && (
            <div className="cta-card">
              <h3>Ready to start learning?</h3>
              <p>Get instant access to all {course.lessons?.length || 0} lessons</p>
              <button className="cta-enroll-btn" onClick={handleEnroll} disabled={enrolling}>
                {enrolling
                  ? <><FiLoader className="btn-spinner" /> Enrolling...</>
                  : <>Enroll for {course.price === 0 ? 'FREE' : `$${course.price}`} <FiArrowRight /></>
                }
              </button>
            </div>
          )}

          {isInstructor && (
            <div className="instructor-notice">
              <HiOutlineAcademicCap size={16} />
              <span>You're viewing as an instructor.</span>
              <button onClick={() => navigate('/instructor/dashboard')}>
                <FiEdit2 size={13} /> Edit Course
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="cd-sidebar">
          <div className="price-card">
            <div className="price-top">
              {course.price === 0
                ? <span className="price-free">Free</span>
                : <><span className="price-main">${course.price}</span><span className="price-sub">USD</span></>
              }
              <span className="price-access">· lifetime access</span>
            </div>

            <div className="price-body">
              {isStudent && (
                <>
                  {enrolled ? (
                    <>
                      <div className="enrolled-badge">
                        <FiCheckCircle size={14} /> You're enrolled
                      </div>
                      <div className="progress-section">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <button className="start-btn" onClick={handleStartLearning}>
                        <FiPlay size={13} fill="#E1F5EE" /> Continue learning
                      </button>
                    </>
                  ) : (
                    <button className="enroll-btn" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling
                        ? <><FiLoader className="btn-spinner" /> Enrolling...</>
                        : 'Enroll Now'
                      }
                    </button>
                  )}
                </>
              )}

              {isInstructor && (
                <button className="edit-course-btn" onClick={() => navigate('/instructor/dashboard')}>
                  <FiEdit2 size={14} /> Edit Course
                </button>
              )}

              <div className="price-features">
                {[
                  [FiBook,        `${course.lessons?.length || 0} on-demand lessons`],
                  [FiClock,       'Lifetime access'],
                  [FiAward,       'Certificate of completion'],
                  [FiSmartphone,  'Mobile & desktop access'],
                ].map(([Icon, text]) => (
                  <div key={text} className="pf-row">
                    <span className="pf-icon"><Icon size={12} /></span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CourseDetails;