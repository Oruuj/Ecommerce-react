import React from "react";
import { Navigate } from "react-router-dom";

const allowedRoles = ["Admin", "SuperAdmin", "Moderator"];

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    if (!userRoles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
