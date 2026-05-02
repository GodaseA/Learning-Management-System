// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import api from '../services/api';
// import './InstructorDashboard.css';

// const InstructorDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showStudentsModal, setShowStudentsModal] = useState(false);
//   const [courseStudents, setCourseStudents] = useState([]);
//   const [showLessonsModal, setShowLessonsModal] = useState(false);
//   const [courseLessons, setCourseLessons] = useState([]);
//   const [showAddLessonForm, setShowAddLessonForm] = useState(false);
//   const [showEditLessonForm, setShowEditLessonForm] = useState(false);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [loadingLessons, setLoadingLessons] = useState(false);
  
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [editImageFile, setEditImageFile] = useState(null);
//   const [editImagePreview, setEditImagePreview] = useState('');

//   const [newCourse, setNewCourse] = useState({
//     title: '',
//     description: '',
//     category: 'Development',
//     level: 'Beginner',
//     price: 0,
//     duration: 0,
//     thumbnail: ''
//   });

//   const [newLesson, setNewLesson] = useState({
//     title: '',
//     description: '',
//     videoUrl: '',
//     duration: 0,
//     order: 1,
//     isFree: false
//   });

//   useEffect(() => {
//     if (user && user.role === 'instructor') {
//       fetchMyCourses();
//     }
//   }, [user]);

//   const fetchMyCourses = async () => {
//     try {
//       const { data } = await api.get('/courses');
//       const myCourses = data.filter(course => course.instructor?._id === user?._id);
//       setCourses(myCourses);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLessons = async (courseId) => {
//     try {
//       const { data } = await api.get(`/lessons/course/${courseId}`);
//       setCourseLessons(data);
//     } catch (error) {
//       console.error('Error fetching lessons:', error);
//       setCourseLessons([]);
//     }
//   };

//   const fetchCourseStudents = async (courseId) => {
//     try {
//       const { data } = await api.get(`/enrollments/course-students/${courseId}`);
//       setCourseStudents(data);
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       setCourseStudents([]);
//     }
//   };

//   const handleCreateCourse = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('courseData', JSON.stringify({
//         ...newCourse,
//         instructor: user._id,
//         isPublished: true
//       }));
//       if (imageFile) {
//         formData.append('thumbnail', imageFile);
//       }
      
//       const { data } = await api.post('/courses', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       setCourses([...courses, data]);
//       setShowCreateForm(false);
//       setNewCourse({
//         title: '',
//         description: '',
//         category: 'Development',
//         level: 'Beginner',
//         price: 0,
//         duration: 0,
//         thumbnail: ''
//       });
//       setImageFile(null);
//       setImagePreview('');
//       alert('Course created successfully!');
//     } catch (error) {
//       console.error('Error creating course:', error);
//       alert('Failed to create course');
//     }
//   };

//   const handleUpdateCourse = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('courseData', JSON.stringify({
//         title: selectedCourse.title,
//         description: selectedCourse.description,
//         category: selectedCourse.category,
//         level: selectedCourse.level,
//         price: selectedCourse.price,
//         duration: selectedCourse.duration
//       }));
//       if (editImageFile) {
//         formData.append('thumbnail', editImageFile);
//       }
      
//       const { data } = await api.put(`/courses/${selectedCourse._id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       setCourses(courses.map(c => c._id === data._id ? data : c));
//       setShowEditForm(false);
//       setSelectedCourse(null);
//       setEditImageFile(null);
//       setEditImagePreview('');
//       alert('Course updated successfully!');
//     } catch (error) {
//       console.error('Error updating course:', error);
//       alert('Failed to update course');
//     }
//   };

//   const handleDeleteCourse = async (courseId) => {
//     if (window.confirm('Are you sure you want to delete this course?')) {
//       try {
//         await api.delete(`/courses/${courseId}`);
//         setCourses(courses.filter(c => c._id !== courseId));
//         alert('Course deleted successfully');
//       } catch (error) {
//         console.error('Error deleting course:', error);
//         alert('Failed to delete course');
//       }
//     }
//   };

//   const handleViewStudents = async (course) => {
//     setSelectedCourse(course);
//     setLoadingStudents(true);
//     await fetchCourseStudents(course._id);
//     setLoadingStudents(false);
//     setShowStudentsModal(true);
//   };

//   const handleViewLessons = async (course) => {
//     console.log("Opening lessons modal for:", course.title);
//     setSelectedCourse(course);
//     setLoadingLessons(true);
//     await fetchLessons(course._id);
//     setLoadingLessons(false);
//     setShowLessonsModal(true);
//   };

//   const handleAddLesson = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post(`/lessons/course/${selectedCourse._id}`, {
//         ...newLesson,
//         order: courseLessons.length + 1
//       });
//       await fetchLessons(selectedCourse._id);
//       setShowAddLessonForm(false);
//       setNewLesson({
//         title: '',
//         description: '',
//         videoUrl: '',
//         duration: 0,
//         order: 1,
//         isFree: false
//       });
//       alert('Lesson added successfully!');
//     } catch (error) {
//       console.error('Error adding lesson:', error);
//       alert('Failed to add lesson');
//     }
//   };

//   const handleUpdateLesson = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/lessons/${selectedLesson._id}`, selectedLesson);
//       await fetchLessons(selectedCourse._id);
//       setShowEditLessonForm(false);
//       setSelectedLesson(null);
//       alert('Lesson updated successfully!');
//     } catch (error) {
//       console.error('Error updating lesson:', error);
//       alert('Failed to update lesson');
//     }
//   };

//   const handleDeleteLesson = async (lessonId) => {
//     if (window.confirm('Are you sure you want to delete this lesson?')) {
//       try {
//         await api.delete(`/lessons/${lessonId}`);
//         await fetchLessons(selectedCourse._id);
//         alert('Lesson deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting lesson:', error);
//         alert('Failed to delete lesson');
//       }
//     }
//   };

//   const handleEditCourse = (course) => {
//     setSelectedCourse(course);
//     setEditImagePreview(course.thumbnail);
//     setShowEditForm(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleEditImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setEditImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEditImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (!user || user.role !== 'instructor') {
//     return (
//       <div className="instructor-dashboard">
//         <div className="access-denied">
//           <h2>Access Denied</h2>
//           <p>This page is only for instructors.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return <div className="loading">Loading dashboard...</div>;
//   }

//   return (
//     <div className="instructor-dashboard">
//       <div className="dashboard-header">
//         <h1>Instructor Dashboard</h1>
//         <p>Welcome back, {user.name}!</p>
//         <button className="create-btn" onClick={() => setShowCreateForm(true)}>
//           + Create New Course
//         </button>
//       </div>

//       {/* Create Course Modal */}
//       {showCreateForm && (
//         <div className="modal" onClick={() => setShowCreateForm(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Create New Course</h2>
//             <form onSubmit={handleCreateCourse}>
//               <input type="text" placeholder="Title" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} required />
//               <textarea placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} required />
//               <input type="file" accept="image/*" onChange={handleImageChange} />
//               {imagePreview && <img src={imagePreview} alt="Preview" style={{maxWidth: '200px'}} />}
//               <button type="submit">Create</button>
//               <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Course Modal */}
//       {showEditForm && selectedCourse && (
//         <div className="modal" onClick={() => setShowEditForm(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Edit Course</h2>
//             <form onSubmit={handleUpdateCourse}>
//               <input type="text" placeholder="Title" value={selectedCourse.title} onChange={(e) => setSelectedCourse({...selectedCourse, title: e.target.value})} required />
//               <textarea placeholder="Description" value={selectedCourse.description} onChange={(e) => setSelectedCourse({...selectedCourse, description: e.target.value})} required />
//               <input type="file" accept="image/*" onChange={handleEditImageChange} />
//               {editImagePreview && <img src={editImagePreview} alt="Preview" style={{maxWidth: '200px'}} />}
//               <button type="submit">Update</button>
//               <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Lessons Modal */}
//       {showLessonsModal && selectedCourse && (
//         <div className="modal" onClick={() => setShowLessonsModal(false)}>
//           <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
//             <h2>Lessons: {selectedCourse.title}</h2>
//             <button onClick={() => setShowAddLessonForm(true)}>+ Add Lesson</button>
            
//             {loadingLessons ? (
//               <p>Loading...</p>
//             ) : courseLessons.length === 0 ? (
//               <p>No lessons yet. Click "Add Lesson" to get started.</p>
//             ) : (
//               courseLessons.map((lesson, idx) => (
//                 <div key={lesson._id} style={{border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>
//                   <h4>{idx + 1}. {lesson.title}</h4>
//                   <p>{lesson.description}</p>
//                   <small>Duration: {lesson.duration} min | {lesson.isFree ? 'Free' : 'Premium'}</small>
//                   <div>
//                     <button onClick={() => { setSelectedLesson(lesson); setShowEditLessonForm(true); }}>Edit</button>
//                     <button onClick={() => handleDeleteLesson(lesson._id)}>Delete</button>
//                   </div>
//                 </div>
//               ))
//             )}
//             <button onClick={() => setShowLessonsModal(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* Add Lesson Modal */}
//       {showAddLessonForm && selectedCourse && (
//         <div className="modal" onClick={() => setShowAddLessonForm(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Add Lesson to {selectedCourse.title}</h2>
//             <form onSubmit={handleAddLesson}>
//               <input type="text" placeholder="Title" value={newLesson.title} onChange={(e) => setNewLesson({...newLesson, title: e.target.value})} required />
//               <textarea placeholder="Description" value={newLesson.description} onChange={(e) => setNewLesson({...newLesson, description: e.target.value})} required />
//               <input type="url" placeholder="Video URL" value={newLesson.videoUrl} onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})} required />
//               <input type="number" placeholder="Duration (minutes)" value={newLesson.duration} onChange={(e) => setNewLesson({...newLesson, duration: parseInt(e.target.value)})} required />
//               <label>
//                 <input type="checkbox" checked={newLesson.isFree} onChange={(e) => setNewLesson({...newLesson, isFree: e.target.checked})} />
//                 Free Preview
//               </label>
//               <button type="submit">Add Lesson</button>
//               <button type="button" onClick={() => setShowAddLessonForm(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Lesson Modal */}
//       {showEditLessonForm && selectedLesson && (
//         <div className="modal" onClick={() => setShowEditLessonForm(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Edit Lesson</h2>
//             <form onSubmit={handleUpdateLesson}>
//               <input type="text" placeholder="Title" value={selectedLesson.title} onChange={(e) => setSelectedLesson({...selectedLesson, title: e.target.value})} required />
//               <textarea placeholder="Description" value={selectedLesson.description} onChange={(e) => setSelectedLesson({...selectedLesson, description: e.target.value})} required />
//               <input type="url" placeholder="Video URL" value={selectedLesson.videoUrl} onChange={(e) => setSelectedLesson({...selectedLesson, videoUrl: e.target.value})} required />
//               <input type="number" placeholder="Duration (minutes)" value={selectedLesson.duration} onChange={(e) => setSelectedLesson({...selectedLesson, duration: parseInt(e.target.value)})} required />
//               <label>
//                 <input type="checkbox" checked={selectedLesson.isFree} onChange={(e) => setSelectedLesson({...selectedLesson, isFree: e.target.checked})} />
//                 Free Preview
//               </label>
//               <button type="submit">Update</button>
//               <button type="button" onClick={() => setShowEditLessonForm(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Students Modal */}
//       {showStudentsModal && selectedCourse && (
//         <div className="modal" onClick={() => setShowStudentsModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Students: {selectedCourse.title}</h2>
//             {loadingStudents ? (
//               <p>Loading...</p>
//             ) : courseStudents.length === 0 ? (
//               <p>No students enrolled yet.</p>
//             ) : (
//               courseStudents.map((student, idx) => (
//                 <div key={student._id} style={{border: '1px solid #ddd', padding: '10px', margin: '5px 0', borderRadius: '5px'}}>
//                   <strong>{student.name || 'Student'}</strong> - {student.email || 'No email'}
//                 </div>
//               ))
//             )}
//             <button onClick={() => setShowStudentsModal(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* Courses List */}
//       <div className="courses-list">
//         <h2>My Courses ({courses.length})</h2>
//         {courses.length === 0 ? (
//           <p>No courses yet. Click "Create New Course" to get started!</p>
//         ) : (
//           <div className="courses-grid">
//             {courses.map(course => (
//               <div key={course._id} className="course-item">
//                 <img src={course.thumbnail || 'https://picsum.photos/seed/' + course._id + '/300/200'} alt={course.title} style={{width: '200px', height: '150px', objectFit: 'cover'}} />
//                 <div>
//                   <h3>{course.title}</h3>
//                   <p>{course.description?.substring(0, 100)}</p>
//                   <div className="course-actions">
//                     <button onClick={() => handleEditCourse(course)}>Edit</button>
//                     <button onClick={() => handleViewLessons(course)}>Lessons ({course.lessons?.length || 0})</button>
//                     <button onClick={() => handleViewStudents(course)}>Students ({course.studentsEnrolled?.length || 0})</button>
//                     <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InstructorDashboard;



































































import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Video, Users, X, Upload, BookOpen } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import './InstructorDashboard.css';

const CATEGORIES = ['Development', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced'];

const EMPTY_COURSE = { title: '', description: '', category: 'Development', level: 'Beginner', price: 0, duration: 0, thumbnail: '' };
const EMPTY_LESSON = { title: '', description: '', videoUrl: '', duration: 0, order: 1, isFree: false };

const Avatar = ({ name, size = 32 }) => {
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  return (
    <div className="id-avatar" style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
};

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses]                   = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [showCreateForm, setShowCreateForm]     = useState(false);
  const [showEditForm, setShowEditForm]         = useState(false);
  const [selectedCourse, setSelectedCourse]     = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [courseStudents, setCourseStudents]     = useState([]);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [courseLessons, setCourseLessons]       = useState([]);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);
  const [showEditLessonForm, setShowEditLessonForm] = useState(false);
  const [selectedLesson, setSelectedLesson]     = useState(null);
  const [loadingStudents, setLoadingStudents]   = useState(false);
  const [loadingLessons, setLoadingLessons]     = useState(false);
  const [imageFile, setImageFile]               = useState(null);
  const [imagePreview, setImagePreview]         = useState('');
  const [editImageFile, setEditImageFile]       = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [newCourse, setNewCourse]               = useState(EMPTY_COURSE);
  const [newLesson, setNewLesson]               = useState(EMPTY_LESSON);

  useEffect(() => { if (user?.role === 'instructor') fetchMyCourses(); }, [user]);

  const fetchMyCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data.filter(c => c.instructor?._id === user?._id));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchLessons = async (courseId) => {
    try { const { data } = await api.get(`/lessons/course/${courseId}`); setCourseLessons(data); }
    catch { setCourseLessons([]); }
  };

  const fetchCourseStudents = async (courseId) => {
    try { const { data } = await api.get(`/enrollments/course-students/${courseId}`); setCourseStudents(data); }
    catch { setCourseStudents([]); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('courseData', JSON.stringify({ ...newCourse, instructor: user._id, isPublished: true }));
      if (imageFile) fd.append('thumbnail', imageFile);
      const { data } = await api.post('/courses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCourses(prev => [...prev, data]);
      setShowCreateForm(false); setNewCourse(EMPTY_COURSE); setImageFile(null); setImagePreview('');
    } catch (e) { console.error(e); }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      const { title, description, category, level, price, duration } = selectedCourse;
      fd.append('courseData', JSON.stringify({ title, description, category, level, price, duration }));
      if (editImageFile) fd.append('thumbnail', editImageFile);
      const { data } = await api.put(`/courses/${selectedCourse._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCourses(prev => prev.map(c => c._id === data._id ? data : c));
      setShowEditForm(false); setSelectedCourse(null); setEditImageFile(null); setEditImagePreview('');
    } catch (e) { console.error(e); }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;
    try { await api.delete(`/courses/${courseId}`); setCourses(prev => prev.filter(c => c._id !== courseId)); }
    catch (e) { console.error(e); }
  };

  const handleViewStudents = async (course) => {
    setSelectedCourse(course); setLoadingStudents(true);
    await fetchCourseStudents(course._id);
    setLoadingStudents(false); setShowStudentsModal(true);
  };

  const handleViewLessons = async (course) => {
    setSelectedCourse(course); setLoadingLessons(true);
    await fetchLessons(course._id);
    setLoadingLessons(false); setShowLessonsModal(true);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/lessons/course/${selectedCourse._id}`, { ...newLesson, order: courseLessons.length + 1 });
      await fetchLessons(selectedCourse._id);
      setShowAddLessonForm(false); setNewLesson(EMPTY_LESSON);
    } catch (e) { console.error(e); }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/lessons/${selectedLesson._id}`, selectedLesson);
      await fetchLessons(selectedCourse._id);
      setShowEditLessonForm(false); setSelectedLesson(null);
    } catch (e) { console.error(e); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try { await api.delete(`/lessons/${lessonId}`); await fetchLessons(selectedCourse._id); }
    catch (e) { console.error(e); }
  };

  const onImgChange = (e, setFile, setPreview) => {
    const file = e.target.files[0]; if (!file) return;
    setFile(file);
    const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(file);
  };

  const totalStudents = courses.reduce((a, c) => a + (c.studentsEnrolled?.length || 0), 0);
  const totalLessons  = courses.reduce((a, c) => a + (c.lessons?.length || 0), 0);

  if (!user || user.role !== 'instructor') {
    return (
      <div className="id-page">
        <div className="id-access-denied">
          <BookOpen size={32} />
          <h2>Access denied</h2>
          <p>This page is only for instructors.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="id-loading">
        <svg className="id-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="id-page">

      {/* ── Topbar ── */}
      <div className="id-topbar">
        <div className="id-topbar-left">
          <div className="id-eyebrow">Instructor dashboard</div>
          <h1>Welcome back, {user.name}</h1>
          <p>Manage your courses, lessons, and students</p>
        </div>
        <div className="id-stat-row">
          {[[courses.length, 'Courses'], [totalStudents, 'Students'], [totalLessons, 'Lessons']].map(([n, l]) => (
            <div key={l} className="id-stat">
              <div className="id-stat-num">{n}</div>
              <div className="id-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="id-body">
        <div className="id-sec-header">
          <div className="id-sec-title">My courses ({courses.length})</div>
          <button className="id-create-btn" onClick={() => setShowCreateForm(true)}>
            <Plus size={13} /> Create new course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="id-empty">
            <BookOpen size={28} color="#b4b2a9" />
            <p>No courses yet. Click "Create new course" to get started.</p>
          </div>
        ) : (
          <div className="id-courses">
            {courses.map(course => (
              <div key={course._id} className="id-course-row">
                <img
                  className="id-course-thumb"
                  src={course.thumbnail || `https://picsum.photos/seed/${course._id}/144/104`}
                  alt={course.title}
                />
                <div className="id-course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description?.substring(0, 100)}{course.description?.length > 100 ? '…' : ''}</p>
                  <div className="id-course-meta">
                    <span className="id-tag green">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                    {course.category && <span className="id-tag">{course.category}</span>}
                    {course.level    && <span className="id-tag">{course.level}</span>}
                  </div>
                </div>
                <div className="id-course-actions">
                  <button className="id-btn" onClick={() => { setSelectedCourse(course); setEditImagePreview(course.thumbnail); setShowEditForm(true); }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button className="id-btn" onClick={() => handleViewLessons(course)}>
                    <Video size={12} /> Lessons ({course.lessons?.length || 0})
                  </button>
                  <button className="id-btn" onClick={() => handleViewStudents(course)}>
                    <Users size={12} /> Students ({course.studentsEnrolled?.length || 0})
                  </button>
                  <button className="id-btn danger" onClick={() => handleDeleteCourse(course._id)}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Course Modal ── */}
      {showCreateForm && (
        <div className="id-modal-backdrop" onClick={() => setShowCreateForm(false)}>
          <div className="id-modal" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <h2>Create new course</h2>
              <button className="id-modal-close" onClick={() => setShowCreateForm(false)}><X size={16} /></button>
            </div>
            <form className="id-form" onSubmit={handleCreateCourse}>
              <div className="id-field">
                <label>Title</label>
                <input type="text" placeholder="e.g. React for Beginners" value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})} required />
              </div>
              <div className="id-field">
                <label>Description</label>
                <textarea rows={3} placeholder="What will students learn?" value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})} required />
              </div>
              <div className="id-field-row">
                <div className="id-field">
                  <label>Category</label>
                  <select value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="id-field">
                  <label>Level</label>
                  <select value={newCourse.level} onChange={e => setNewCourse({...newCourse, level: e.target.value})}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="id-field">
                  <label>Price ($)</label>
                  <input type="number" min="0" value={newCourse.price}
                    onChange={e => setNewCourse({...newCourse, price: +e.target.value})} />
                </div>
              </div>
              <div className="id-field">
                <label>Thumbnail</label>
                <label className="id-upload-btn">
                  <Upload size={13} /> Choose image
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e => onImgChange(e, setImageFile, setImagePreview)} />
                </label>
                {imagePreview && <img className="id-img-preview" src={imagePreview} alt="Preview" />}
              </div>
              <div className="id-modal-footer">
                <button type="button" className="id-btn" onClick={() => setShowCreateForm(false)}>Cancel</button>
                <button type="submit" className="id-create-btn">Create course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Course Modal ── */}
      {showEditForm && selectedCourse && (
        <div className="id-modal-backdrop" onClick={() => setShowEditForm(false)}>
          <div className="id-modal" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <h2>Edit course</h2>
              <button className="id-modal-close" onClick={() => setShowEditForm(false)}><X size={16} /></button>
            </div>
            <form className="id-form" onSubmit={handleUpdateCourse}>
              <div className="id-field">
                <label>Title</label>
                <input type="text" value={selectedCourse.title}
                  onChange={e => setSelectedCourse({...selectedCourse, title: e.target.value})} required />
              </div>
              <div className="id-field">
                <label>Description</label>
                <textarea rows={3} value={selectedCourse.description}
                  onChange={e => setSelectedCourse({...selectedCourse, description: e.target.value})} required />
              </div>
              <div className="id-field-row">
                <div className="id-field">
                  <label>Category</label>
                  <select value={selectedCourse.category} onChange={e => setSelectedCourse({...selectedCourse, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="id-field">
                  <label>Level</label>
                  <select value={selectedCourse.level} onChange={e => setSelectedCourse({...selectedCourse, level: e.target.value})}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="id-field">
                  <label>Price ($)</label>
                  <input type="number" min="0" value={selectedCourse.price}
                    onChange={e => setSelectedCourse({...selectedCourse, price: +e.target.value})} />
                </div>
              </div>
              <div className="id-field">
                <label>Thumbnail</label>
                <label className="id-upload-btn">
                  <Upload size={13} /> Change image
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e => onImgChange(e, setEditImageFile, setEditImagePreview)} />
                </label>
                {editImagePreview && <img className="id-img-preview" src={editImagePreview} alt="Preview" />}
              </div>
              <div className="id-modal-footer">
                <button type="button" className="id-btn" onClick={() => setShowEditForm(false)}>Cancel</button>
                <button type="submit" className="id-create-btn">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Lessons Modal ── */}
      {showLessonsModal && selectedCourse && (
        <div className="id-modal-backdrop" onClick={() => setShowLessonsModal(false)}>
          <div className="id-modal id-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <div>
                <h2>Lessons</h2>
                <p className="id-modal-sub">{selectedCourse.title}</p>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <button className="id-create-btn" onClick={() => setShowAddLessonForm(true)}>
                  <Plus size={12} /> Add lesson
                </button>
                <button className="id-modal-close" onClick={() => setShowLessonsModal(false)}><X size={16} /></button>
              </div>
            </div>
            {loadingLessons ? (
              <div className="id-modal-empty">Loading lessons…</div>
            ) : courseLessons.length === 0 ? (
              <div className="id-modal-empty">No lessons yet. Add your first one above.</div>
            ) : (
              <div className="id-lessons-list">
                {courseLessons.map((lesson, idx) => (
                  <div key={lesson._id} className="id-lesson-row">
                    <div className="id-lesson-num">{idx + 1}</div>
                    <div className="id-lesson-info">
                      <h4>{lesson.title}</h4>
                      <p>{lesson.description}</p>
                      <div className="id-course-meta" style={{marginTop:4}}>
                        <span className="id-tag">{lesson.duration} min</span>
                        {lesson.isFree && <span className="id-tag green">Free preview</span>}
                      </div>
                    </div>
                    <div className="id-course-actions">
                      <button className="id-btn" onClick={() => { setSelectedLesson(lesson); setShowEditLessonForm(true); }}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button className="id-btn danger" onClick={() => handleDeleteLesson(lesson._id)}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add Lesson Modal ── */}
      {showAddLessonForm && selectedCourse && (
        <div className="id-modal-backdrop" onClick={() => setShowAddLessonForm(false)}>
          <div className="id-modal" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <h2>Add lesson</h2>
              <button className="id-modal-close" onClick={() => setShowAddLessonForm(false)}><X size={16} /></button>
            </div>
            <form className="id-form" onSubmit={handleAddLesson}>
              <div className="id-field"><label>Title</label>
                <input type="text" placeholder="Lesson title" value={newLesson.title}
                  onChange={e => setNewLesson({...newLesson, title: e.target.value})} required />
              </div>
              <div className="id-field"><label>Description</label>
                <textarea rows={2} value={newLesson.description}
                  onChange={e => setNewLesson({...newLesson, description: e.target.value})} required />
              </div>
              <div className="id-field"><label>Video URL</label>
                <input type="url" placeholder="https://…" value={newLesson.videoUrl}
                  onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} required />
              </div>
              <div className="id-field-row">
                <div className="id-field"><label>Duration (min)</label>
                  <input type="number" min="0" value={newLesson.duration}
                    onChange={e => setNewLesson({...newLesson, duration: +e.target.value})} required />
                </div>
                <div className="id-field id-field-check">
                  <label className="id-checkbox-label">
                    <input type="checkbox" checked={newLesson.isFree}
                      onChange={e => setNewLesson({...newLesson, isFree: e.target.checked})} />
                    Free preview
                  </label>
                </div>
              </div>
              <div className="id-modal-footer">
                <button type="button" className="id-btn" onClick={() => setShowAddLessonForm(false)}>Cancel</button>
                <button type="submit" className="id-create-btn">Add lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Lesson Modal ── */}
      {showEditLessonForm && selectedLesson && (
        <div className="id-modal-backdrop" onClick={() => setShowEditLessonForm(false)}>
          <div className="id-modal" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <h2>Edit lesson</h2>
              <button className="id-modal-close" onClick={() => setShowEditLessonForm(false)}><X size={16} /></button>
            </div>
            <form className="id-form" onSubmit={handleUpdateLesson}>
              <div className="id-field"><label>Title</label>
                <input type="text" value={selectedLesson.title}
                  onChange={e => setSelectedLesson({...selectedLesson, title: e.target.value})} required />
              </div>
              <div className="id-field"><label>Description</label>
                <textarea rows={2} value={selectedLesson.description}
                  onChange={e => setSelectedLesson({...selectedLesson, description: e.target.value})} required />
              </div>
              <div className="id-field"><label>Video URL</label>
                <input type="url" value={selectedLesson.videoUrl}
                  onChange={e => setSelectedLesson({...selectedLesson, videoUrl: e.target.value})} required />
              </div>
              <div className="id-field-row">
                <div className="id-field"><label>Duration (min)</label>
                  <input type="number" min="0" value={selectedLesson.duration}
                    onChange={e => setSelectedLesson({...selectedLesson, duration: +e.target.value})} required />
                </div>
                <div className="id-field id-field-check">
                  <label className="id-checkbox-label">
                    <input type="checkbox" checked={selectedLesson.isFree}
                      onChange={e => setSelectedLesson({...selectedLesson, isFree: e.target.checked})} />
                    Free preview
                  </label>
                </div>
              </div>
              <div className="id-modal-footer">
                <button type="button" className="id-btn" onClick={() => setShowEditLessonForm(false)}>Cancel</button>
                <button type="submit" className="id-create-btn">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Students Modal ── */}
      {showStudentsModal && selectedCourse && (
        <div className="id-modal-backdrop" onClick={() => setShowStudentsModal(false)}>
          <div className="id-modal" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <div>
                <h2>Students</h2>
                <p className="id-modal-sub">{selectedCourse.title}</p>
              </div>
              <button className="id-modal-close" onClick={() => setShowStudentsModal(false)}><X size={16} /></button>
            </div>
            {loadingStudents ? (
              <div className="id-modal-empty">Loading students…</div>
            ) : courseStudents.length === 0 ? (
              <div className="id-modal-empty">No students enrolled yet.</div>
            ) : (
              <div className="id-students-list">
                {courseStudents.map(student => (
                  <div key={student._id} className="id-student-row">
                    <Avatar name={student.name} />
                    <div>
                      <div className="id-student-name">{student.name || 'Student'}</div>
                      <div className="id-student-email">{student.email || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default InstructorDashboard;