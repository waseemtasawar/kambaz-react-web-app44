import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router";
import PeopleTable from "../Courses/People/Table";
import * as client from "./client";

export default function Users() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const { uid } = useParams();

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setAllUsers(users);
    applyFilters(users, role, name);
  };

  const applyFilters = (
    users: any[],
    roleFilter: string,
    nameFilter: string
  ) => {
    let result = [...users];

    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (nameFilter) {
      const searchTerm = nameFilter.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsers(result);
  };

  const createUser = async () => {
    try {
      const newUser = {
        firstName: "New",
        lastName: `User${allUsers.length + 1}`,
        username: `newuser${Date.now()}`,
        password: "password123",
        email: `email${allUsers.length + 1}@neu.edu`,
        section: "S101",
        role: "STUDENT",
      };

      const createdUser = await client.createUser(newUser);
      const updatedUsers = [...allUsers, createdUser];

      setAllUsers(updatedUsers);
      applyFilters(updatedUsers, role, name);
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
    applyFilters(allUsers, selectedRole, name);
  };

  const handleNameChange = (searchName: string) => {
    setName(searchName);
    applyFilters(allUsers, role, searchName);
  };

  useEffect(() => {
    fetchUsers();
  }, [uid]);

  return (
    <div>
      <button
        onClick={createUser}
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Users
      </button>
      <h3>Users</h3>
      <input
        onChange={(e) => handleNameChange(e.target.value)}
        value={name}
        placeholder="Search people"
        className="form-control float-start w-25 me-2 wd-filter-by-name"
      />
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="form-select float-start w-25 wd-select-role"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select>

      <PeopleTable users={filteredUsers} />
    </div>
  );
}
