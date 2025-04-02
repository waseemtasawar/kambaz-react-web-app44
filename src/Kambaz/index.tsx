import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse } from "./reducer";
import KambazNavigation from "./Navigation";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";

import "./styles.css";

export default function Kambaz() {
  const [localCourses, setLocalCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({});
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const reduxCourses = useSelector(
    (state: any) => state.coursesReducer?.courses || []
  );
  const enrollments = useSelector(
    (state: any) => state.enrollmentsReducer?.enrollments || []
  );

  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setLocalCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setLocalCourses([...localCourses, newCourse]);
  };

  const deleteCourseLocal = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setLocalCourses(localCourses.filter((c) => c._id !== courseId));
  };

  const updateCourseLocal = async (updatedCourse: any) => {
    await courseClient.updateCourse(updatedCourse);
    setLocalCourses(
      localCourses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
    );
  };

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid } = useParams();

  const handleDeleteCourse = async (courseId: string) => {
    if (currentUser?.role === "FACULTY") {
      await deleteCourseLocal(courseId);
      dispatch(deleteCourse(courseId)); // Sync action
    }
  };

  const handleAddCourse = (newCourse: any) => {
    if (!currentUser || currentUser.role !== "FACULTY") return;

    const newCourseWithId = {
      ...newCourse,
      _id: `RS${Math.floor(Math.random() * 1000)}`,
      author: currentUser._id,
    };
    dispatch(addCourse(newCourseWithId));
  };

  const handleUpdateCourse = async (updatedCourse: any) => {
    if (currentUser?.role === "FACULTY") {
      await updateCourseLocal(updatedCourse);
      dispatch(updateCourse(updatedCourse));
    }
  };

  useEffect(() => {
    if (currentUser?.role === "STUDENT" && cid) {
      const isEnrolled = enrollments.some(
        (enrollment: { user: string; course: string }) =>
          enrollment.user === currentUser._id && enrollment.course === cid
      );
      if (!isEnrolled) {
        navigate("/Kambaz/Dashboard", { replace: true });
      }
    }
  }, [cid, currentUser, enrollments, navigate]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    courses={localCourses}
                    course={course}
                    setCourse={setCourse}
                    addNewCourse={handleAddCourse}
                    deleteCourse={handleDeleteCourse}
                    updateCourse={handleUpdateCourse}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <Courses courses={reduxCourses} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
