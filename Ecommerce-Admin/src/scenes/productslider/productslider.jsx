import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./productSlider.css";

const ProductSlider = () => {
    const [sliders, setSliders] = useState([]);
    const [newSlider, setNewSlider] = useState({
        name: "",
        desc: "",
        imageFile: null,
        productId: "",
        buttonUrl: "",
        buttonText: "",
    });
    const [editSlider, setEditSlider] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const res = await axios.get("/ProductSlider/UI/GetAll");
            setSliders(res.data);
        } catch {
            toast.error("Failed to fetch product sliders");
        }
    };

    const handleCreateChange = (e) => {
        const { name, value, files } = e.target;
        setNewSlider((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", newSlider.name);
        formData.append("Desc", newSlider.desc);
        if (newSlider.imageFile) formData.append("ImageFile", newSlider.imageFile);
        if (newSlider.productId) formData.append("ProductId", newSlider.productId);
        formData.append("ButtonUrl", newSlider.buttonUrl);
        formData.append("ButtonText", newSlider.buttonText);

        try {
            await axios.post("/ProductSlider/Admin/Create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Product slider created");
            setNewSlider({ name: "", desc: "", imageFile: null, productId: "", buttonUrl: "", buttonText: "" });
            setShowCreate(false);
            fetchSliders();
        } catch (err) {
            toast.error("Failed to create product slider");
            console.error(err.response?.data || err.message);
        }
    };

    const handleUpdateChange = (e) => {
        const { name, value, files } = e.target;
        setEditSlider((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Id", editSlider.id);
        if (editSlider.name) formData.append("Name", editSlider.name);
        if (editSlider.desc) formData.append("Desc", editSlider.desc);
        if (editSlider.imageFile) formData.append("ImageFile", editSlider.imageFile);
        if (editSlider.productId) formData.append("ProductId", editSlider.productId);
        if (editSlider.buttonUrl) formData.append("ButtonUrl", editSlider.buttonUrl);
        if (editSlider.buttonText) formData.append("ButtonText", editSlider.buttonText);

        try {
            await axios.put("/ProductSlider/Admin/Update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Product slider updated");
            setEditSlider(null);
            fetchSliders();
        } catch (err) {
            toast.error("Failed to update product slider");
            console.error(err.response?.data || err.message);
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/ProductSlider/Admin/Delete/${deleteId}`);
            toast.success("Product slider deleted");
            fetchSliders();
        } catch {
            toast.error("Failed to delete product slider");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create Product Slider</button>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit}>
                        <h3>Create Product Slider</h3>
                        <input
                            name="name"
                            placeholder="Name"
                            value={newSlider.name}
                            onChange={handleCreateChange}
                            required
                        />
                        <textarea
                            name="desc"
                            placeholder="Description"
                            value={newSlider.desc}
                            onChange={handleCreateChange}
                        />
                        <input
                            name="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleCreateChange}
                            required
                        />
                        <input
                            name="productId"
                            placeholder="Product ID"
                            value={newSlider.productId}
                            onChange={handleCreateChange}
                        />
                        <input
                            name="buttonUrl"
                            placeholder="Button URL"
                            value={newSlider.buttonUrl}
                            onChange={handleCreateChange}
                        />
                        <input
                            name="buttonText"
                            placeholder="Button Text"
                            value={newSlider.buttonText}
                            onChange={handleCreateChange}
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

            {/* Edit Modal */}
            {editSlider && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleUpdateSubmit}>
                        <h3>Edit Product Slider</h3>
                        <input
                            name="name"
                            value={editSlider.name || ""}
                            onChange={handleUpdateChange}
                        />
                        <textarea
                            name="desc"
                            value={editSlider.desc || ""}
                            onChange={handleUpdateChange}
                        />
                        <input
                            name="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleUpdateChange}
                        />
                        <input
                            name="productId"
                            placeholder="Product ID"
                            value={editSlider.productId || ""}
                            onChange={handleUpdateChange}
                        />
                        <input
                            name="buttonUrl"
                            placeholder="Button URL"
                            value={editSlider.buttonUrl || ""}
                            onChange={handleUpdateChange}
                        />
                        <input
                            name="buttonText"
                            placeholder="Button Text"
                            value={editSlider.buttonText || ""}
                            onChange={handleUpdateChange}
                        />
                        <div className="modal-actions">
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setEditSlider(null)}>
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
                        <p>Are you sure you want to delete this product slider?</p>
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
                            <th>Name</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Product ID</th>
                            <th>Button Text</th>
                            <th>Button URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliders.map((slider) => (
                            <tr key={slider.id}>
                                <td>{slider.name}</td>
                                <td>{slider.desc}</td>
                                <td>
                                    <img
                                        src={`https://localhost:7279/${slider.imageUrl}`}
                                        alt={slider.name}
                                        style={{ width: "50px", height: "auto" }}
                                    />
                                </td>
                                <td>{slider.productId || "-"}</td>
                                <td>{slider.buttonText || "-"}</td>
                                <td>{slider.buttonUrl || "-"}</td>
                                <td style={{ width: "200px" }}>
                                    <div className="btns">
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditSlider(slider)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => confirmDelete(slider.id)}
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

export default ProductSlider;
