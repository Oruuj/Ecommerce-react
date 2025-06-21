import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
    <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <Link to="/auth">Go to Login</Link>
    </div>
);

export default Unauthorized;
