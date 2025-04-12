import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { enrollStudent, unenrollStudent } from "../store/reducer";

interface Course {
  _id: string;
  name: string;
  description?: string;
  enrolled?: boolean;
  // Add other course properties as needed
}

interface DashboardProps {
  courses: Course[];
  course: Course;
  setCourse: (course: Course) => void;
  addNewCourse: (newCourse: Course) => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: (updatedCourse: Course) => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => Promise<void>;
}

export default function Dashboard({
  courses,
  enrolling,
  setEnrolling,
  updateEnrollment,
}: DashboardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const filterCourses = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        if (currentUser.role === "STUDENT") {
          const filtered = enrolling
            ? courses
            : courses.filter((c) => c.enrolled);

          if (isMounted) setFilteredCourses(filtered);
        } else {
          if (isMounted) setFilteredCourses(courses);
        }
      } catch (err) {
        if (isMounted) setError("Failed to load courses");
        console.error("Course filtering error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    filterCourses();

    return () => {
      isMounted = false;
    };
  }, [courses, currentUser, enrolling]);

  const handleEnrollmentChange = async (
    courseId: string,
    shouldEnroll: boolean
  ) => {
    try {
      setLoading(true);

      // Optimistic update
      setFilteredCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? { ...c, enrolled: shouldEnroll } : c
        )
      );

      await updateEnrollment(courseId, shouldEnroll);

      dispatch(
        shouldEnroll
          ? enrollStudent({ user: currentUser._id, course: courseId })
          : unenrollStudent({ userId: currentUser._id, courseId })
      );
    } catch (err) {
      setError(`Failed to ${shouldEnroll ? "enroll" : "unenroll"}`);
      // Revert optimistic update
      setFilteredCourses(courses);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="alert alert-warning">
        Please sign in to view your dashboard.
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {currentUser?.role === "STUDENT" && (
          <button
            onClick={() => setEnrolling(!enrolling)}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : enrolling
              ? "Show My Courses"
              : "Show All Courses"}
          </button>
        )}
      </div>
      <hr />

      <h2 id="wd-dashboard-published">
        {currentUser?.role === "STUDENT"
          ? enrolling
            ? "All Available Courses"
            : "My Enrolled Courses"
          : "All Courses"}{" "}
        ({filteredCourses.length})
      </h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div
          className="row row-cols-1 row-cols-md-4 g-4"
          id="wd-dashboard-courses"
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course._id} className="col">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      {course.name}
                      {enrolling && currentUser?.role === "STUDENT" && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleEnrollmentChange(
                              course._id,
                              !course.enrolled
                            );
                          }}
                          className={`btn btn-sm float-end ${
                            course.enrolled ? "btn-danger" : "btn-success"
                          }`}
                          disabled={loading}
                        >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}
                    </h5>
                    <p className="card-text flex-grow-1">
                      {course.description || "No description available"}
                    </p>
                    <div className="mt-auto">
                      <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          navigate(`/Kambaz/Courses/${course._id}`)
                        }
                        disabled={loading}
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">
                {currentUser?.role === "STUDENT"
                  ? enrolling
                    ? "No courses available to enroll in."
                    : "You are not enrolled in any courses yet."
                  : "No courses available."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
