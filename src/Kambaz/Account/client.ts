import axios from "axios";

// Create an Axios instance with proper defaults
const axiosWithCredentials = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_REMOTE_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
});
const API_BASE = "/api/users";

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(API_BASE);
  return response.data;
};
export const findCoursesForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${API_BASE}/${userId}/courses`
  );
  return response.data;
};
export const createUser = async (user: any) => {
  const response = await axiosWithCredentials.post(API_BASE, user); // Fixed error
  return response.data;
};

export const findMyCourses = async () => {
  try {
    const response = await axiosWithCredentials.get(
      `${API_BASE}/current/courses`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const createCourse = async (course: any) => {
  const response = await axiosWithCredentials.post(
    `${API_BASE}/current/courses`,
    course
  );
  return response.data;
};

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axiosWithCredentials.post(
      `${API_BASE}/signin`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      throw new Error(error.response.data.message || "Login failed");
    } else {
      console.error("Error:", error.message);
      throw new Error("Network error during login");
    }
  }
};

export const findUsersByRole = async (role: string) => {
  const response = await axiosWithCredentials.get(`${API_BASE}?role=${role}`); // Fixed
  return response.data;
};

export const findUsersByPartialName = async (name: string) => {
  const response = await axiosWithCredentials.get(`${API_BASE}?name=${name}`); // Fixed
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${API_BASE}/${userId}`); // Fixed
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axiosWithCredentials.get(`${API_BASE}/${id}`); // Fixed
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.get(`${API_BASE}/profile`);
  return response.data;
};

export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(`${API_BASE}/signup`, user);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${API_BASE}/signout`);
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${API_BASE}/${user._id}`,
    user
  );
  return response.data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${API_BASE}/${userId}/courses/${courseId}`
  );
  return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${API_BASE}/${userId}/courses/${courseId}`
  );
  return response.data;
};
