import React, { useEffect, useState } from "react";
import { User } from "./types";
import axiosInstance from "../../shared/axiosInstance";
import { useNavigate } from "react-router-dom";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const navigate = useNavigate();

  const navigateToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeUserId");
    navigate("/login");
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>("/users");
      console.log("Fetched users:", response.data);
      setUsers(response.data);

      const id = localStorage.getItem("activeUserId");
      const currentUserId = id ? +id : null;

      if (response.data.some((user) => user.id === currentUserId && user.status === "blocked")) {
        navigateToLogin();
      }

      if (response.data.every((user) => user.status === "blocked")) {
        navigateToLogin();
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (id: number) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
  };

  const handleBlockUsers = async () => {
    await Promise.all(selectedUsers.map((id) => axiosInstance.put(`/users/block/${id}`)));
    fetchUsers();
  };

  const handleUnblockUsers = async () => {
    await Promise.all(selectedUsers.map((id) => axiosInstance.put(`/users/unblock/${id}`)));
    fetchUsers();
  };

  const handleDeleteUsers = async () => {
    await Promise.all(selectedUsers.map((id) => axiosInstance.delete(`/users/${id}`)));
    fetchUsers();
  };

  return (
    <div className="mt-5 container">
      <h2 className="text-center mb-5">User Management table</h2>
      <div className=" mb-2 d-flex gap-2 align-items-center">
        <button onClick={handleBlockUsers} className="btn btn-danger">
          Block
        </button>

        <button onClick={handleUnblockUsers} className="border-0 bg-transparent">
          <i className="bi bi-check-circle fs-4"></i>
        </button>
        <button onClick={handleDeleteUsers} className="border-0 bg-transparent">
          <i className="bi bi-trash fs-4"></i>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedUsers(e.target.checked ? users.map((user) => user.id) : []);
                  }}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Time</th>
              <th>Last LogIn time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.status === "blocked" ? "table-warning" : "table-light"}>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.registration_time).toLocaleString()}</td>
                <td>{user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : ""}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
