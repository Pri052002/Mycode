// CourseList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5033/api/Professor/courses', {
          headers: {
            // Include authorization header if needed
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust this based on your auth implementation
          },
        });
        setCourses(response.data);
      } catch (error) {
        setError('Failed to fetch courses.');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Your Courses</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {courses.length > 0 ? (
          courses.map(course => (
            <li key={course.courseId} className="list-group-item">
              <h5>{course.title}</h5>
              <p>{course.description}</p>
              <p><strong>Start Date:</strong> {new Date(course.courseStartDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(course.courseEndDate).toLocaleDateString()}</p>
              <p><strong>Payment:</strong> ${course.payment}</p>
              <p><strong>Status:</strong> {course.isApproved ? 'Approved' : 'Pending Approval'}</p>
            </li>
          ))
        ) : (
          <li className="list-group-item">No courses available.</li>
        )}
      </ul>
    </div>
  );
};

export default CourseList;
