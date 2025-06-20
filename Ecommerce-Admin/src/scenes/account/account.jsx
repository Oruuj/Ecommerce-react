import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./account.css";

const Account = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // full role objects with id + name
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(""); // will hold role id

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/Account/Admin/GetUsers");
            setUsers(res.data);
        } catch {
            toast.error("Failed to fetch users");
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await axios.get("/Account/Admin/GetRolesWithUsers");
            setRoles(res.data); // keep full roles with id & name
        } catch {
            toast.error("Failed to fetch roles");
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setSelectedRole("");
        setShowRoleModal(true);
    };

    const assignRole = async () => {
        if (!selectedRole) {
            return toast.error("Please select a role");
        }
        try {
            await axios.put(
                `/Account/Admin/AddRoleToUser?UserId=${selectedUser.id}&RoleId=${selectedRole}`
            );
            toast.success("Role assigned");
            setShowRoleModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch {
            toast.error("Failed to assign role");
        }
    };

    // Here we send role NAME as RoleId to backend per your request
    const removeRole = async (roleName) => {
        try {
            await axios.put(
                `/Account/Admin/RemoveRoleFromUser?UserId=${selectedUser.id}&RoleId=${encodeURIComponent(roleName)}`
            );
            toast.success("Role removed");
            fetchUsers();
        } catch {
            toast.error("Failed to remove role");
        }
    };

    return (
        <div className="container">
            <h2>User Management</h2>

            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.fullName}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <span key={role} style={{ marginRight: "10px" }}>
                                                    {role}{" "}
                                                    <button
                                                        className="x-btn"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            removeRole(role); // role here is the role NAME
                                                        }}
                                                        style={{
                                                            color: "red",
                                                            cursor: "pointer",
                                                            border: "none",
                                                            background: "none",
                                                        }}
                                                    >
                                                        x
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span>No Roles</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className="m-btn" onClick={() => openRoleModal(user)}>
                                            Manage Roles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showRoleModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Assign Role to {selectedUser.fullName}</h3>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            style={{ padding: "8px", width: "100%", marginBottom: "20px" }}
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <div className="modal-actions">
                            <button onClick={assignRole} style={{ marginRight: "10px" }}>
                                Assign
                            </button>
                            <button
                                onClick={() => {
                                    setShowRoleModal(false);
                                    setSelectedUser(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
