import axios from "axios";

const axiosWithCredentials = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_REMOTE_SERVER,
});

const COURSES_API = "/api/courses";

export const fetchAllCourses = async (): Promise<any[]> => {
  try {
    const response = await axiosWithCredentials.get(COURSES_API);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to fetch courses");
  }
};

export const createCourse = async (course: any): Promise<any> => {
  try {
    const response = await axiosWithCredentials.post(COURSES_API, course);
    return response.data;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw new Error("Failed to create course");
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  } catch (error) {
    console.error("Failed to delete course:", error);
    throw new Error("Failed to delete course");
  }
};

export const updateCourse = async (course: any): Promise<any> => {
  try {
    const response = await axiosWithCredentials.put(
      `${COURSES_API}/${course._id}`,
      course
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update course:", error);
    throw new Error("Failed to update course");
  }
};

export const findModulesForCourse = async (
  courseId: string
): Promise<any[]> => {
  try {
    const response = await axiosWithCredentials.get(
      `${COURSES_API}/${courseId}/modules`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    throw new Error("Failed to fetch modules");
  }
};
