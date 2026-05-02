// import React from 'react';
// import { Link } from 'react-router-dom';
// import './CourseCard.css';

// const CourseCard = ({ course }) => {
//   const getImageUrl = () => {
//     if (course.thumbnail && course.thumbnail !== '' && !course.thumbnail.includes('placeholder')) {
//       return course.thumbnail;
//     }
//     // Use LoremFlick for reliable images
//     return `https://picsum.photos/seed/${course._id || Math.random()}/300/200`;
//   };

//   return (
//     <div className="course-card">
//       <img 
//         src={getImageUrl()} 
//         alt={course.title}
//         className="course-image"
//         onError={(e) => {
//           e.target.src = `https://picsum.photos/seed/${Date.now()}/300/200`;
//         }}
//       />
//       <div className="course-content">
//         <h3 className="course-title">{course.title}</h3>
//         <p className="course-description">
//           {course.description?.substring(0, 100)}...
//         </p>
//         <div className="course-meta">
//           <span className="course-level">{course.level}</span>
//           <span className="course-duration">⏱️ {course.duration} hours</span>
//         </div>
//         <div className="course-footer">
//           <span className="course-price">
//             {course.price === 0 ? 'Free' : `$${course.price}`}
//           </span>
//           <Link to={`/course/${course._id}`} className="view-btn">
//             View Course
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;




























import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const getImageUrl = () => {
    if (course.thumbnail && course.thumbnail !== '' && !course.thumbnail.includes('placeholder')) {
      return course.thumbnail;
    }
    return `https://picsum.photos/seed/${course._id || Math.random()}/300/200`;
  };

  const isFree = course.price === 0;

  return (
    <div className="course-card">
      <div className="course-image-wrap">
        <img
          src={getImageUrl()}
          alt={course.title}
          className="course-image"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${Date.now()}/300/200`;
          }}
        />
        {course.level && (
          <span className="level-badge">{course.level}</span>
        )}
        <span className={`price-tag ${isFree ? 'free' : 'paid'}`}>
          {isFree ? 'Free' : `$${course.price}`}
        </span>
      </div>

      <div className="course-body">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">
          {course.description?.substring(0, 100)}...
        </p>

        <div className="course-meta">
          <span className="meta-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {course.duration} hours
          </span>
          <span className="meta-dot" />
          <span className="meta-pill">{course.level}</span>
        </div>

        <div className="course-footer">
          <span className={`price-label ${isFree ? 'free' : ''}`}>
            {isFree ? 'Free' : `$${course.price}`}
          </span>
          <Link to={`/course/${course._id}`} className="view-btn">
            View course →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;