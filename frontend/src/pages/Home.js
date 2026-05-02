// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';
// import CourseCard from '../components/CourseCard';
// import './Home.css';

// const Home = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const { data } = await api.get('/courses');
//       setCourses(data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading amazing courses...</div>;
//   }

//   return (
//     <div className="home">
//       <div className="hero-section">
//         <h1 className="hero-title">Start Your Learning Journey Today</h1>
//         <p className="hero-subtitle">
//           Access 1000+ courses from expert instructors. Learn anytime, anywhere.
//         </p>
//         <Link to="/courses" className="hero-btn">
//           Explore Courses
//         </Link>
//       </div>

//       <div className="features-section">
//         <h2 className="section-title">Why Choose LearnHub?</h2>
//         <div className="features-grid">
//           <div className="feature-card">
//             <div className="feature-icon">🎓</div>
//             <h3>Expert Instructors</h3>
//             <p>Learn from industry professionals</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">📱</div>
//             <h3>Mobile Friendly</h3>
//             <p>Learn on any device</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">🏆</div>
//             <h3>Certificates</h3>
//             <p>Earn certificates on completion</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">💬</div>
//             <h3>Community</h3>
//             <p>Connect with fellow learners</p>
//           </div>
//         </div>
//       </div>

//       <div className="featured-courses">
//         <h2 className="section-title">Featured Courses</h2>
//         <div className="courses-grid">
//           {courses.slice(0, 4).map(course => (
//             <CourseCard key={course._id} course={course} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;





































import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, BookOpen, Users, Award, MessageSquare } from 'lucide-react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import './Home.css';

const FEATURES = [
  { icon: <Award size={16} />, title: 'Expert instructors', desc: 'Learn from verified industry professionals with real-world experience' },
  { icon: <BookOpen size={16} />, title: 'Mobile friendly', desc: 'Seamless experience on any device — phone, tablet, or desktop' },
  { icon: <Award size={16} />, title: 'Certificates', desc: 'Earn shareable certificates on every course you complete' },
  { icon: <Users size={16} />, title: 'Community', desc: 'Connect and collaborate with thousands of fellow learners' },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="hm-loading">
        <svg className="hm-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Loading courses...
      </div>
    );
  }

  return (
    <div className="hm-page">

      {/* ── Hero ── */}
      <section className="hm-hero">
        <div className="hm-hero-pattern" />
        <div className="hm-hero-content">
          <div className="hm-hero-badge">
            <span className="hm-hero-dot" />
            New courses added weekly
          </div>
          <h1 className="hm-hero-title">Start Your Learning Journey Today</h1>
          <p className="hm-hero-sub">
            Access 1000+ courses from expert instructors. Learn anytime, anywhere, at your own pace.
          </p>
          <div className="hm-hero-actions">
            <Link to="/courses" className="hm-btn-primary">
              <Play size={13} fill="currentColor" /> Explore Courses
            </Link>
            <Link to="/dashboard" className="hm-btn-outline">View my learning</Link>
          </div>
          <div className="hm-hero-stats">
            {[['1,200+', 'Courses available'], ['48k', 'Active learners'], ['320', 'Expert instructors']].map(
              ([num, label]) => (
                <div key={label}>
                  <div className="hm-hstat-num">{num}</div>
                  <div className="hm-hstat-label">{label}</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <div className="hm-body">

        {/* ── Features ── */}
        <section>
          <div className="hm-sec-header">
            <h2 className="hm-sec-title">Why choose LearnHub?</h2>
          </div>
          <div className="hm-features">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="hm-feat">
                <div className="hm-feat-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Courses ── */}
        <section>
          <div className="hm-sec-header">
            <h2 className="hm-sec-title">Featured courses</h2>
            <Link to="/courses" className="hm-sec-link">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="hm-courses-grid">
            {courses.slice(0, 4).map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;