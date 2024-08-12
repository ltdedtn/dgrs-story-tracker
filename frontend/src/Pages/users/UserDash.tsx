import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Role } from "../../models/User";
import RoleChangeModal from "./RoleChangeModal"; // Import the modal component

const staticRoles: Role[] = [
  { roleId: 2, roleName: "Standard User" },
  { roleId: 3, roleName: "Editor" },
  { roleId: 4, roleName: "Admin" },
];

const UserDash = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<User[]>(
          "https://localhost:7023/api/User",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        if ((error as any).response?.status === 401) {
          navigate("/unauthorized");
        } else {
          setError("Failed to fetch users. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleEdit = (userId: number) => {
    navigate(`/dash/users/${userId}/edit`);
  };

  const handleDelete = async (userId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://localhost:7023/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user.userId !== userId));
      } catch (error) {
        console.error("Error deleting user", error);
        setError("Failed to delete user. Please try again later.");
      }
    }
  };

  const handleOpenRoleChangeModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseRoleChangeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async (userId: number, newRoleId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7023/api/User/${userId}/roles`,
        [newRoleId],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user.userId === userId
            ? {
                ...user,
                roles: staticRoles.filter((role) => role.roleId === newRoleId),
              }
            : user
        )
      );
      handleCloseRoleChangeModal();
    } catch (error) {
      console.error("Error changing role", error);
      setError("Failed to change role. Please try again later.");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>{user.roles.map((role) => role.roleName).join(", ")}</td>
                <td className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(user.userId)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(user.userId)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenRoleChangeModal(user)}
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <RoleChangeModal
          isOpen={isModalOpen}
          onClose={handleCloseRoleChangeModal}
          roles={staticRoles}
          onRoleChange={(roleId) =>
            handleRoleChange(selectedUser.userId, roleId)
          }
        />
      )}
    </div>
  );
};

export default UserDash;
