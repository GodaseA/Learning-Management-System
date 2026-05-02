// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import api from '../services/api';
// import './LessonView.css';

// const LessonView = () => {
//   const { courseId, lessonId } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [lesson, setLesson] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [completedLessons, setCompletedLessons] = useState([]);
//   const [markingComplete, setMarkingComplete] = useState(false);

//   const isInstructor = user?.role === 'instructor';
//   const isStudent = user?.role === 'student';

//   useEffect(() => {
//     fetchCourseAndLesson();
//     if (user && isStudent) {
//       checkEnrollmentAndProgress();
//     } else if (isInstructor) {
//       setIsEnrolled(true);
//       setLoading(false);
//     }
//   }, [courseId, lessonId, user]);

//   const fetchCourseAndLesson = async () => {
//     try {
//       const { data } = await api.get(`/courses/${courseId}`);
//       setCourse(data);
//       const currentLesson = data.lessons?.find(l => l._id === lessonId);
//       setLesson(currentLesson);
//     } catch (error) {
//       console.error('Error fetching lesson:', error);
//     }
//   };

//   const checkEnrollmentAndProgress = async () => {
//     try {
//       const { data } = await api.get(`/enrollments/progress/${courseId}?studentId=${user._id}`);
//       setIsEnrolled(data.enrolled);
//       setProgress(data.progress);
//       setCompletedLessons(data.completedLessons || []);
//     } catch (error) {
//       console.error('Error checking progress:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markLessonComplete = async () => {
//     if (!isStudent || !isEnrolled || markingComplete) return;
    
//     setMarkingComplete(true);
//     try {
//       console.log('Marking lesson as complete...');
//       const response = await api.post('/enrollments/complete-lesson', {
//         studentId: user._id,
//         courseId: courseId,
//         lessonId: lessonId
//       });
      
//       console.log('Response:', response.data);
      
//       if (response.data.success) {
//         setCompletedLessons([...completedLessons, lessonId]);
//         setProgress(response.data.progress);
        
//         const message = response.data.progress === 100 
//           ? '🎉 Congratulations! You have completed the course!' 
//           : `✅ Lesson completed! Course progress: ${response.data.progress}%`;
        
//         alert(message);
//       } else {
//         alert('Failed to mark lesson as complete. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error marking lesson complete:', error);
//       if (error.response) {
//         console.error('Server response:', error.response.data);
//         alert(error.response.data.message || 'Failed to mark lesson as complete');
//       } else {
//         alert('Network error. Please check your connection.');
//       }
//     } finally {
//       setMarkingComplete(false);
//     }
//   };

//   const getYouTubeEmbedUrl = (url) => {
//     if (!url) return '';
    
//     let videoId = null;
    
//     if (url.includes('youtube.com/watch')) {
//       const urlParams = new URLSearchParams(url.split('?')[1]);
//       videoId = urlParams.get('v');
//     } else if (url.includes('youtu.be/')) {
//       videoId = url.split('youtu.be/')[1].split('?')[0];
//     } else if (url.includes('youtube.com/embed/')) {
//       videoId = url.split('embed/')[1].split('?')[0];
//     }
    
//     if (videoId) {
//       return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
//     }
    
//     return url;
//   };

//   const embedUrl = lesson?.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : '';
//   const isValidYouTube = embedUrl.includes('youtube.com/embed');
//   const isLessonCompleted = completedLessons.includes(lessonId);

//   if (loading) {
//     return <div className="loading">Loading lesson...</div>;
//   }

//   if (!lesson) {
//     return <div className="error">Lesson not found</div>;
//   }

//   const canAccess = isInstructor || isEnrolled || lesson.isFree;

//   if (!canAccess) {
//     return (
//       <div className="access-denied">
//         <h2>Access Denied</h2>
//         <p>You need to enroll in this course to access this lesson.</p>
//         <button onClick={() => navigate(`/course/${courseId}`)} className="enroll-now-btn">
//           Enroll Now
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="lesson-view">
//       <div className="lesson-sidebar">
//         <h3>{course?.title}</h3>
//         <div className="lesson-list">
//           {course?.lessons?.map((l, index) => {
//             const isCompleted = completedLessons.includes(l._id);
//             return (
//               <div 
//                 key={l._id} 
//                 className={`lesson-item ${l._id === lessonId ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
//                 onClick={() => navigate(`/course/${courseId}/lesson/${l._id}`)}
//               >
//                 <div className="lesson-status">
//                   {isCompleted ? '✅' : (l._id === lessonId ? '▶️' : `${index + 1}`)}
//                 </div>
//                 <div className="lesson-details">
//                   <div className="lesson-title">{l.title}</div>
//                   <div className="lesson-meta">
//                     <span>{l.duration} min</span>
//                     {l.isFree && <span className="free-badge">FREE</span>}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="lesson-content">
//         <div className="video-section">
//           {isValidYouTube ? (
//             <div className="video-wrapper">
//               <iframe
//                 src={embedUrl}
//                 title={lesson.title}
//                 className="video-frame"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//           ) : (
//             <div className="video-error">
//               <h3>Video Not Available</h3>
//               <p>The video URL is not valid.</p>
//               <p>URL: {lesson.videoUrl}</p>
//             </div>
//           )}
//         </div>

//         <div className="lesson-info">
//           <h2>{lesson.title}</h2>
//           <p>{lesson.description}</p>
//           {isLessonCompleted && <span className="completed-badge">✓ Completed</span>}
//         </div>

//         {isStudent && isEnrolled && !isLessonCompleted && (
//           <div className="lesson-actions">
//             <button 
//               className="mark-complete-btn" 
//               onClick={markLessonComplete}
//               disabled={markingComplete}
//             >
//               {markingComplete ? 'Marking...' : '✓ Mark as Complete'}
//             </button>
//           </div>
//         )}

//         {isStudent && isEnrolled && isLessonCompleted && (
//           <div className="completed-message">
//             ✅ Lesson completed! Great job!
//           </div>
//         )}

//         <div className="navigation-buttons">
//           <button onClick={() => {
//             const currentIndex = course?.lessons?.findIndex(l => l._id === lessonId);
//             if (currentIndex > 0) {
//               navigate(`/course/${courseId}/lesson/${course.lessons[currentIndex - 1]._id}`);
//             }
//           }} disabled={course?.lessons?.findIndex(l => l._id === lessonId) === 0}>
//             ← Previous
//           </button>
//           <div className="lesson-counter">
//             Lesson {course?.lessons?.findIndex(l => l._id === lessonId) + 1} of {course?.lessons?.length}
//             {progress > 0 && <span className="overall-progress"> | Overall: {Math.round(progress)}%</span>}
//           </div>
//           <button onClick={() => {
//             const currentIndex = course?.lessons?.findIndex(l => l._id === lessonId);
//             if (currentIndex < course?.lessons?.length - 1) {
//               navigate(`/course/${courseId}/lesson/${course.lessons[currentIndex + 1]._id}`);
//             }
//           }} disabled={course?.lessons?.findIndex(l => l._id === lessonId) === course?.lessons?.length - 1}>
//             Next →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LessonView;













































import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Play, Lock } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import './LessonView.css';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse]                   = useState(null);
  const [lesson, setLesson]                   = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [isEnrolled, setIsEnrolled]           = useState(false);
  const [progress, setProgress]               = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [markingComplete, setMarkingComplete] = useState(false);

  const isInstructor = user?.role === 'instructor';
  const isStudent    = user?.role === 'student';

  useEffect(() => {
    fetchCourseAndLesson();
    if (user && isStudent) checkEnrollmentAndProgress();
    else if (isInstructor) { setIsEnrolled(true); setLoading(false); }
  }, [courseId, lessonId, user]);

  const fetchCourseAndLesson = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      setCourse(data);
      setLesson(data.lessons?.find(l => l._id === lessonId));
    } catch (e) { console.error(e); }
  };

  const checkEnrollmentAndProgress = async () => {
    try {
      const { data } = await api.get(`/enrollments/progress/${courseId}?studentId=${user._id}`);
      setIsEnrolled(data.enrolled);
      setProgress(data.progress);
      setCompletedLessons(data.completedLessons || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const markLessonComplete = async () => {
    if (!isStudent || !isEnrolled || markingComplete) return;
    setMarkingComplete(true);
    try {
      const { data } = await api.post('/enrollments/complete-lesson', {
        studentId: user._id, courseId, lessonId
      });
      if (data.success) {
        setCompletedLessons(prev => [...prev, lessonId]);
        setProgress(data.progress);
      }
    } catch (e) { console.error(e); } finally { setMarkingComplete(false); }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = null;
    if (url.includes('youtube.com/watch'))      videoId = new URLSearchParams(url.split('?')[1]).get('v');
    else if (url.includes('youtu.be/'))         videoId = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('youtube.com/embed/')) videoId = url.split('embed/')[1].split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : url;
  };

  const embedUrl       = lesson?.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : '';
  const isValidYouTube = embedUrl.includes('youtube.com/embed');
  const isCompleted    = completedLessons.includes(lessonId);
  const lessons        = course?.lessons || [];
  const currentIndex   = lessons.findIndex(l => l._id === lessonId);

  if (loading) return (
    <div className="lv-loading">
      <svg className="lv-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Loading lesson…
    </div>
  );

  if (!lesson) return (
    <div className="lv-error">Lesson not found.</div>
  );

  const canAccess = isInstructor || isEnrolled || lesson.isFree;

  if (!canAccess) return (
    <div className="lv-gate">
      <div className="lv-gate-card">
        <div className="lv-gate-icon"><Lock size={22} /></div>
        <h2>Enroll to watch</h2>
        <p>This lesson is part of a paid course. Enroll to get full access.</p>
        <button className="lv-enroll-btn" onClick={() => navigate(`/course/${courseId}`)}>
          View course
        </button>
      </div>
    </div>
  );

  return (
    <div className="lv-page">

      {/* ── Sidebar ── */}
      <aside className="lv-sidebar">
        <div className="lv-sidebar-header">
          <div className="lv-sidebar-course">{course?.title}</div>
          {progress > 0 && (
            <div className="lv-sidebar-progress">
              <div className="lv-progress-bar-wrap">
                <div className="lv-progress-bar-fill" style={{ width: `${Math.round(progress)}%` }} />
              </div>
              <span className="lv-progress-label">{Math.round(progress)}% complete</span>
            </div>
          )}
        </div>

        <div className="lv-lesson-list">
          {lessons.map((l, idx) => {
            const done    = completedLessons.includes(l._id);
            const active  = l._id === lessonId;
            return (
              <div
                key={l._id}
                className={`lv-lesson-item ${active ? 'lv-active' : ''} ${done ? 'lv-done' : ''}`}
                onClick={() => navigate(`/course/${courseId}/lesson/${l._id}`)}
              >
                <div className="lv-lesson-icon">
                  {done    ? <CheckCircle size={15} />  :
                   active  ? <Play size={12} fill="currentColor" /> :
                             <span className="lv-idx">{idx + 1}</span>}
                </div>
                <div className="lv-lesson-meta">
                  <div className="lv-lesson-title">{l.title}</div>
                  <div className="lv-lesson-dur">
                    {l.duration} min
                    {l.isFree && <span className="lv-free-badge">Free</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="lv-main">

        {/* Video */}
        <div className="lv-video-section">
          {isValidYouTube ? (
            <div className="lv-video-wrap">
              <iframe
                src={embedUrl}
                title={lesson.title}
                className="lv-video-frame"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="lv-video-error">
              <Play size={32} color="#b4b2a9" />
              <p>Video unavailable — invalid URL.</p>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="lv-info-bar">
          <div className="lv-info-left">
            <h2 className="lv-lesson-name">{lesson.title}</h2>
            <p className="lv-lesson-desc">{lesson.description}</p>
          </div>
          {isCompleted && (
            <div className="lv-completed-badge">
              <CheckCircle size={14} /> Completed
            </div>
          )}
        </div>

        {/* Mark Complete */}
        {isStudent && isEnrolled && !isCompleted && (
          <div className="lv-actions">
            <button
              className="lv-complete-btn"
              onClick={markLessonComplete}
              disabled={markingComplete}
            >
              {markingComplete
                ? <><svg className="lv-spinner" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Saving…</>
                : <><CheckCircle size={14} /> Mark as complete</>}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="lv-nav">
          <button
            className="lv-nav-btn"
            onClick={() => navigate(`/course/${courseId}/lesson/${lessons[currentIndex - 1]._id}`)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <div className="lv-nav-counter">
            Lesson {currentIndex + 1} of {lessons.length}
          </div>

          <button
            className="lv-nav-btn lv-nav-next"
            onClick={() => navigate(`/course/${courseId}/lesson/${lessons[currentIndex + 1]._id}`)}
            disabled={currentIndex === lessons.length - 1}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>

      </main>
    </div>
  );
};

export default LessonView;