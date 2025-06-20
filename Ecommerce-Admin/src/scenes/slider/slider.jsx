import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./slider.css";

const Slider = () => {
    const [sliders, setSliders] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [newSlider, setNewSlider] = useState({
        title: "",
        description: "",
        imageFile: null,
        buttonText: "",
        buttonUrl: "",
    });

    const [editSlider, setEditSlider] = useState({
        id: null,
        title: "",
        description: "",
        imageFile: null,
        buttonText: "",
        buttonUrl: "",
    });

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const res = await axios.get("/Slider/UI/GetAll");
            setSliders(res.data);
        } catch {
            toast.error("Failed to fetch sliders");
        }
    };

    const handleCreateChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imageFile") {
            setNewSlider((prev) => ({ ...prev, imageFile: files[0] }));
        } else {
            setNewSlider((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("Title", newSlider.title);
            formData.append("Description", newSlider.description);
            if (newSlider.imageFile) formData.append("ImageFile", newSlider.imageFile);
            formData.append("ButtonText", newSlider.buttonText);
            formData.append("ButtonUrl", newSlider.buttonUrl);

            await axios.post("/Slider/Admin/Create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Slider created");
            setNewSlider({
                title: "",
                description: "",
                imageFile: null,
                buttonText: "",
                buttonUrl: "",
            });
            setShowCreate(false);
            fetchSliders();
        } catch {
            toast.error("Failed to create slider");
        }
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imageFile") {
            setEditSlider((prev) => ({ ...prev, imageFile: files[0] }));
        } else {
            setEditSlider((prev) => ({ ...prev, [name]: value }));
        }
    };

    const openEditModal = (slider) => {
        setEditSlider({
            id: slider.id,
            title: slider.title,
            description: slider.description,
            imageFile: null,
            buttonText: slider.buttonText,
            buttonUrl: slider.buttonUrl,
        });
        setShowEdit(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("Id", editSlider.id);
            if (editSlider.title !== undefined)
                formData.append("Title", editSlider.title);
            if (editSlider.description !== undefined)
                formData.append("Description", editSlider.description);
            if (editSlider.imageFile) formData.append("ImageFile", editSlider.imageFile);
            if (editSlider.buttonText !== undefined)
                formData.append("ButtonText", editSlider.buttonText);
            if (editSlider.buttonUrl !== undefined)
                formData.append("ButtonUrl", editSlider.buttonUrl);

            await axios.put("/Slider/Admin/Update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Slider updated");
            setShowEdit(false);
            fetchSliders();
        } catch {
            toast.error("Failed to update slider");
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Slider/Admin/Delete/${deleteId}`);
            toast.success("Slider deleted");
            fetchSliders();
        } catch {
            toast.error("Failed to delete slider");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create Slider</button>
            </div>

            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit} encType="multipart/form-data">
                        <h3>Create Slider</h3>
                        <input
                            name="title"
                            placeholder="Title"
                            value={newSlider.title}
                            onChange={handleCreateChange}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={newSlider.description}
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
                            name="buttonText"
                            placeholder="Button Text"
                            value={newSlider.buttonText}
                            onChange={handleCreateChange}
                        />
                        <input
                            name="buttonUrl"
                            placeholder="Button URL"
                            value={newSlider.buttonUrl}
                            onChange={handleCreateChange}
                        />
                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
            {showEdit && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleUpdateSubmit} encType="multipart/form-data">
                        <h3>Edit Slider</h3>
                        <input
                            name="title"
                            placeholder="Title"
                            value={editSlider.title}
                            onChange={handleEditChange}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={editSlider.description}
                            onChange={handleEditChange}
                        />
                        <input
                            name="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleEditChange}
                        />
                        <input
                            name="buttonText"
                            placeholder="Button Text"
                            value={editSlider.buttonText}
                            onChange={handleEditChange}
                        />
                        <input
                            name="buttonUrl"
                            placeholder="Button URL"
                            value={editSlider.buttonUrl}
                            onChange={handleEditChange}
                        />
                        <div className="modal-actions">
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setShowEdit(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this slider?</p>
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
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Button Text</th>
                            <th>Button URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliders.map((slider) => (
                            <tr key={slider.id}>
                                <td>{slider.id}</td>
                                <td>{slider.title}</td>
                                <td>{slider.description}</td>
                                <td>
                                    {slider.imageUrl && (
                                        <img
                                            src={`https://localhost:7279/${slider.imageUrl}`}
                                            alt={slider.title}
                                            style={{ width: "80px", height: "auto" }}
                                        />
                                    )}
                                </td>
                                <td>{slider.buttonText || "-"}</td>
                                <td>{slider.buttonUrl || "-"}</td>
                                <td style={{ width: "200px" }}>
                                    <div className="btns">
                                        <button className="edit-btn" onClick={() => openEditModal(slider)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => confirmDelete(slider.id)}>
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

export default Slider;
