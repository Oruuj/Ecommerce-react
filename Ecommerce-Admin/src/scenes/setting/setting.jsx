import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./setting.css";

const Setting = () => {
    const [settings, setSettings] = useState([]);
    const [newSetting, setNewSetting] = useState({ key: "", value: "" });
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteKey, setDeleteKey] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get("/Setting/Admin/GetAllAsyncForAdmin");
            let data = res.data;
            if (!Array.isArray(data)) {
                data = Object.entries(data).map(([key, value]) => ({ key, value }));
            }
            setSettings(data);
        } catch {
            toast.error("Failed to fetch settings");
        }
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setNewSetting((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/Setting/Admin/Create", {
                Key: newSetting.key,
                Value: newSetting.value,
            });
            toast.success("Setting created");
            setNewSetting({ key: "", value: "" });
            setShowCreate(false);
            fetchSettings();
        } catch {
            toast.error("Failed to create setting");
        }
    };

    const confirmDelete = (key) => {
        setDeleteKey(key);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Setting/Admin/Delete?key=${deleteKey}`);
            toast.success("Setting deleted");
            fetchSettings();
        } catch {
            toast.error("Failed to delete setting");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteKey(null);
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create Setting</button>
            </div>

            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit}>
                        <h3>Create Setting</h3>
                        <input
                            name="key"
                            placeholder="Key"
                            value={newSetting.key}
                            onChange={handleCreateChange}
                            required
                        />
                        <input
                            name="value"
                            placeholder="Value"
                            value={newSetting.value}
                            onChange={handleCreateChange}
                            required
                        />
                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowCreate(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>
                            Are you sure you want to delete the setting with key:{" "}
                            <b>{deleteKey}</b>?
                        </p>
                        <div className="modal-actions">
                            <button
                                onClick={handleDelete}
                                style={{ backgroundColor: "#d32f2f", color: "white" }}
                            >
                                Delete
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th style={{ width: "200px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settings.map((setting) => (
                            <tr key={setting.key}>
                                <td>{setting.key}</td>
                                <td>{setting.value}</td>
                                <td>
                                    <div className="btns">
                                        <button
                                            className="delete-btn"
                                            onClick={() => confirmDelete(setting.key)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Setting;
