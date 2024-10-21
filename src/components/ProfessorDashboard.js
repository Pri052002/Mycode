import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CreateCourse from './CreateCourse';

const ProfessorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'Professor') {
            navigate('/login');
        } else {
            fetchCourses();
        }
    }, [navigate]);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5033/api/Professor/courses', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the request header
                },
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setErrorMessage('Failed to fetch courses.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="professor-dashboard">
            <h2>Welcome, {localStorage.getItem('username')}</h2>
        
            <Link to="create-course">
                <button>Create Course</button>
            </Link>
            <Link to="course-list">
                <button>Available Courses</button>
            </Link>
        
            {/* Optionally, you can display the courses if needed */}
            <h3>Your Courses</h3>
            <ul>
                {courses.map(course => (
                    <li key={course.courseId}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p>Status: {course.approvalStatus}</p>
                        {/* If not approved, display waiting for approval */}
                        {!course.isApproved && <p style={{ color: 'red' }}>Waiting for Registrar approval</p>}
                    </li>
                ))}
            </ul>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProfessorDashboard;

