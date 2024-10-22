import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseService from './CourseService'; // API service for backend interaction

const ProfessorDashboard = () => {
  const [professorId, setProfessorId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [modules, setModules] = useState([]);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    price: 0,
    professorId: null,
  });

  const [newModule, setNewModule] = useState({
    title: '',
    content: '',
    courseId: null,
    order: 0,
  });

  // Fetch ProfessorId from localStorage
  useEffect(() => {
    const storedProfessorId = localStorage.getItem('professorId');
    if (storedProfessorId) {
      setProfessorId(parseInt(storedProfessorId));
      setNewCourse((prev) => ({ ...prev, professorId: parseInt(storedProfessorId) }));
    }
    fetchCourses();
    fetchPendingCourses(); // Fetch pending courses
  }, []);

  //courses with respect to the professorid
  const fetchCourses = async () => {
    try {
        const storedProfessorId = localStorage.getItem('professorId'); // Get professorId from localStorage
        if (storedProfessorId) {
            const response = await axios.get(`http://localhost:5033/api/Courses/courses/${storedProfessorId}`);
            setCourses(response.data); // Set courses state with the filtered list
        } else {
            console.error('Professor ID not found in local storage.');
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};


  // Fetch pending courses for approval
  const fetchPendingCourses = async () => {
    try {
      const data = await CourseService.getPendingCourses(); // API to get pending courses
      setPendingCourses(data);
    } catch (error) {
      console.error('Error fetching pending courses:', error);
    }
  };

  // Fetch all modules for a given course
  const fetchModules = async (courseId) => {
    try {
      const data = await CourseService.getModulesByCourseId(courseId);
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  // Create a new course
  const handleCourseSubmit = async (e) => {
    e.preventDefault();

     // Validate if price is a valid number
  if (isNaN(newCourse.price) || newCourse.price <= 0) {
    alert('Please enter a valid price.');
    return;
  }

    try {
      await CourseService.createCourse(newCourse);
      fetchCourses(); // Refresh course list after creation
      setNewCourse({ title: '', description: '', startDate: '', endDate: '', price: 0, professorId });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  // Create a new module
  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate if order is a valid number
  if (isNaN(newModule.order) || newModule.order <= 0) {
    alert('Please enter a valid module order.');
    return;
  }

    try {
      await CourseService.createModule(newModule);
      fetchModules(newModule.courseId); // Refresh module list after creation
      setNewModule({ title: '', content: '', courseId: null, order: 0 });
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };


  return (
    <div className="dashboard">
      <h1>Professor Dashboard</h1>

      <div className="course-section">
        <h2>Create New Course</h2>
        <form onSubmit={handleCourseSubmit}>
          <input
            type="text"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Course Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            required
          />
          <input
            type="date"
            value={newCourse.startDate}
            onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
           
            required
          />
          <input
            type="date"
            value={newCourse.endDate}
            onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Course Price"
            value={newCourse.price}
            onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
            required
          />
          <button type="submit">Create Course</button>
        </form>
      </div>

      <div className="module-section">
        <h2>Create New Module</h2>
        <form onSubmit={handleModuleSubmit}>
          <input
            type="text"
            placeholder="Module Title"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Module Content"
            value={newModule.content}
            onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
          />
          <select
            value={newModule.courseId}
            onChange={(e) => setNewModule({ ...newModule, courseId: parseInt(e.target.value) })}
            required
          >
            <option value="" disabled>Select Course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Module Order"
            value={newModule.order}
            onChange={(e) => setNewModule({ ...newModule, order: parseInt(e.target.value) })}
            required
          />
          <button type="submit">Create Module</button>
        </form>
      </div>

      <div className="courses-section">
        <h2>Your Courses</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.courseId}>
              <strong>{course.title}</strong> - {course.description}
              <button onClick={() => fetchModules(course.courseId)}>View Modules</button>
              <ul>
                {modules
                  .filter((module) => module.courseId === course.courseId)
                  .map((module) => (
                    <li key={module.moduleId}>
                      {module.title} (Order: {module.order})
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="pending-courses-section">
        <h2>Pending Courses for Approval</h2>
       
      </div>
    </div>
  );
};

export default ProfessorDashboard;
