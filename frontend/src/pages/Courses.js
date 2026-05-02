// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import CourseCard from '../components/CourseCard';
// import './Courses.css';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const { data } = await api.get('/courses');
//       setCourses(data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categories = [...new Set(courses.map(course => course.category))];

//   const filteredCourses = courses.filter(course => {
//     const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !selectedCategory || course.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   if (loading) {
//     return <div className="loading">Loading courses...</div>;
//   }

//   return (
//     <div className="courses-page">
//       <div className="courses-header">
//         <h1>All Courses</h1>
//         <p>Discover amazing courses from expert instructors</p>
//       </div>

//       <div className="filters-section">
//         <input
//           type="text"
//           placeholder="Search courses..."
//           className="search-input"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
        
//         <select
//           className="category-filter"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">All Categories</option>
//           {categories.map(cat => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>
//       </div>

//       <div className="courses-grid">
//         {filteredCourses.map(course => (
//           <CourseCard key={course._id} course={course} />
//         ))}
//       </div>

//       {filteredCourses.length === 0 && (
//         <div className="no-results">
//           <p>No courses found. Try adjusting your search.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Courses;


















import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import './Courses.css';

import { FiSearch, FiX, FiBookOpen, FiLoader } from 'react-icons/fi';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="cp-loading">
        <FiLoader className="cp-spinner" />
        <span>Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="courses-page">

      {/* ── Header ── */}
      <div className="cp-header">
        <div className="cp-header-inner">
          <p className="cp-eyebrow">LearnHub</p>
          <h1 className="cp-title">Explore courses</h1>
          <p className="cp-sub">Learn from expert instructors, at your own pace</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="cp-filters">
        <div className="cp-filters-inner">

          <div className="search-wrap">
            <FiSearch className="search-icon" size={14} />
            <input
              type="text"
              className="search-input"
              placeholder="Search courses, topics, instructors…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                <FiX size={13} />
              </button>
            )}
          </div>

          <div className="cat-pills">
            <button
              className={`cat-pill ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Results count ── */}
      <div className="cp-body">
        <div className="results-bar">
          <span>
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {selectedCategory ? ` in ${selectedCategory}` : ''}
            {searchTerm ? ` for "${searchTerm}"` : ''}
          </span>
          {(searchTerm || selectedCategory) && (
            <button
              className="clear-filters"
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            >
              <FiX size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <FiBookOpen size={22} color="#b4b2a9" />
            </div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or clearing the filters.</p>
            <button
              className="no-results-btn"
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Courses;