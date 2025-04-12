import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { addCourse, updateCourse, deleteCourse } from "./reducer";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import Account from "./Account";
import KambazNavigation from "./Navigation";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import "./styles.css";

interface Course {
  _id: string;
  name: string;
  description?: string;
  enrolled?: boolean;
  // Add other course properties as needed
}

export default function Kambaz() {
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const reduxCourses = useSelector(
    (state: any) => state.coursesReducer?.courses || []
  );
  const enrollments = useSelector(
    (state: any) => state.enrollmentsReducer?.enrollments || []
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid } = useParams();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (!currentUser) return;

      if (currentUser.role === "STUDENT") {
        if (enrolling) {
          // Get all courses with enrollment status
          const [allCourses, enrolledCourses] = await Promise.all([
            courseClient.fetchAllCourses(),
            userClient.findCoursesForUser(currentUser._id),
          ]);

          const coursesWithStatus = allCourses.map((c) => ({
            ...c,
            enrolled: enrolledCourses.some((ec) => ec._id === c._id),
          }));

          setLocalCourses(coursesWithStatus);
        } else {
          // Get only enrolled courses
          const enrolledCourses = await userClient.findCoursesForUser(
            currentUser._id
          );
          setLocalCourses(enrolledCourses);
        }
      } else {
        // For faculty/admin, show all courses
        const allCourses = await courseClient.fetchAllCourses();
        setLocalCourses(allCourses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    try {
      setLoading(true);

      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
        dispatch(enrollStudent({ user: currentUser._id, course: courseId }));
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
        dispatch(unenrollStudent({ userId: currentUser._id, courseId }));
      }

      // Refresh courses after enrollment change
      await fetchCourses();
    } catch (error) {
      console.error("Enrollment update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewCourse = async (newCourse: Course) => {
    try {
      setLoading(true);
      const createdCourse = await courseClient.createCourse(newCourse);
      setLocalCourses((prev) => [...prev, createdCourse]);
      dispatch(addCourse(createdCourse));
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourseLocal = async (courseId: string) => {
    try {
      setLoading(true);
      await courseClient.deleteCourse(courseId);
      setLocalCourses((prev) => prev.filter((c) => c._id !== courseId));
      dispatch(deleteCourse(courseId));
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCourseLocal = async (updatedCourse: Course) => {
    try {
      setLoading(true);
      const result = await courseClient.updateCourse(updatedCourse);
      setLocalCourses((prev) =>
        prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );
      dispatch(updateCourse(updatedCourse));
    } catch (error) {
      console.error("Failed to update course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser, enrolling]);

  useEffect(() => {
    if (currentUser?.role === "STUDENT" && cid) {
      const isEnrolled = enrollments.some(
        (e: { user: string; course: string }) =>
          e.user === currentUser._id && e.course === cid
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
                    addNewCourse={addNewCourse}
                    deleteCourse={deleteCourseLocal}
                    updateCourse={updateCourseLocal}
                    enrolling={enrolling}
                    setEnrolling={setEnrolling}
                    updateEnrollment={updateEnrollment}
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
