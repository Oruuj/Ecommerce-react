import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./productfeature.css";

const ProductFeature = () => {
    const [features, setFeatures] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newFeature, setNewFeature] = useState({ name: "", value: "", productId: "" });
    const [editFeature, setEditFeature] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchFeatures = async () => {
        try {
            const res = await axios.get("/ProductFeature/UI/GetAll");
            setFeatures(res.data);
        } catch (err) {
            toast.error("Failed to fetch product features");
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const handleCreateChange = (e) => {
        setNewFeature((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        const { name, value, productId } = newFeature;

        try {
            await axios.post(`/ProductFeature/Admin/Create`, null, {
                params: {
                    Name: name,
                    Value: value,
                    ProductId: parseInt(productId, 10),
                },
            });

            toast.success("Feature created successfully");
            setNewFeature({ name: "", value: "", productId: "" });
            setShowCreate(false);
            fetchFeatures();
        } catch (err) {
            toast.error("Failed to create feature");
            console.error(err.response?.data || err.message);
        }
    };



    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!editFeature?.id) {
            toast.error("Feature ID is missing!");
            return;
        }

        try {
            await axios.put("/ProductFeature/Admin/Update", {
                Id: editFeature.id,
                Name: editFeature.name,
                Value: editFeature.value,
                ProductId: parseInt(editFeature.productId, 10),
            });

            toast.success("Feature updated successfully");
            setEditFeature(null);
            fetchFeatures();
        } catch (err) {
            toast.error("Failed to update feature");
            console.error(err.response?.data || err.message);
        }
    };



    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/ProductFeature/Admin/Delete/${deleteId}`);
            toast.success("Feature deleted");
            setFeatures(features.filter((f) => f.id !== deleteId));
        } catch {
            toast.error("Failed to delete");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create Feature</button>
            </div>

            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit}>
                        <h3>Create Product Feature</h3>
                        <input name="name" placeholder="Name" value={newFeature.name} onChange={handleCreateChange} required />
                        <input name="value" placeholder="Value" value={newFeature.value} onChange={handleCreateChange} required />
                        <input name="productId" type="number" placeholder="Product ID" value={newFeature.productId} onChange={handleCreateChange} required />
                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}



            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this feature?</p>
                        <div className="modal-actions">
                            <button onClick={handleDelete} style={{ backgroundColor: "#d32f2f", color: "white" }}>Delete</button>
                            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Product ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((f) => (
                            <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.name}</td>
                                <td>{f.value}</td>
                                <td>{f.productId}</td>
                                <td>
                                    <div className="btns">
                                        <button className="edit-btn" onClick={() => setEditFeature(f)}>Edit</button>
                                        <button className="delete-btn" onClick={() => confirmDelete(f.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {editFeature && (
                            <div className="modal">
                                <form className="modal-content" onSubmit={handleUpdateSubmit}>
                                    <h3>Edit Product Feature</h3>
                                    <input
                                        name="name"
                                        placeholder="Name"
                                        value={editFeature.name}
                                        onChange={(e) => setEditFeature({ ...editFeature, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        name="value"
                                        placeholder="Value"
                                        value={editFeature.value}
                                        onChange={(e) => setEditFeature({ ...editFeature, value: e.target.value })}
                                        required
                                    />
                                    <input
                                        name="productId"
                                        type="number"
                                        placeholder="Product ID"
                                        value={editFeature.productId}
                                        onChange={(e) => setEditFeature({ ...editFeature, productId: e.target.value })}
                                        required
                                    />
                                    <div className="modal-actions">
                                        <button type="submit">Update</button>
                                        <button type="button" onClick={() => setEditFeature(null)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductFeature;
