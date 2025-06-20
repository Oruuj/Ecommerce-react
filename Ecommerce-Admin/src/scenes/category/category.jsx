import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./category.css";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: "", imageFile: null });
    const [editCategory, setEditCategory] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/Category/UI/GetAll");
            setCategories(res.data);
        } catch {
            toast.error("Failed to fetch categories");
        }
    };

    const handleCreateChange = (e) => {
        const { name, value, files } = e.target;
        setNewCategory((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", newCategory.name);
        formData.append("ImageFile", newCategory.imageFile);

        try {
            await axios.post("/Category/Admin/Create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Category created");
            setNewCategory({ name: "", imageFile: null });
            setShowCreate(false);
            fetchCategories();
        } catch (err) {
            toast.error("Failed to create category");
            console.error(err.response?.data || err.message);
        }
    };

    const handleUpdateChange = (e) => {
        const { name, value, files } = e.target;
        setEditCategory((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Id", editCategory.id);
        formData.append("Name", editCategory.name);
        if (editCategory.imageFile) {
            formData.append("ImageFile", editCategory.imageFile);
        }

        try {
            await axios.put("/Category/Admin/Update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Category updated");
            setEditCategory(null);
            fetchCategories();
        } catch (err) {
            toast.error("Failed to update category");
            console.error(err.response?.data || err.message);
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Category/Admin/Delete?Id=${deleteId}`);
            toast.success("Category deleted");
            fetchCategories();
        } catch {
            toast.error("Failed to delete category");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create Category</button>
            </div>

            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit}>
                        <h3>Create Category</h3>
                        <input name="name" placeholder="Name" value={newCategory.name} onChange={handleCreateChange} required />
                        <input name="imageFile" type="file" accept="image/*" onChange={handleCreateChange} required />
                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {editCategory && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleUpdateSubmit}>
                        <h3>Edit Category</h3>
                        <input name="name" value={editCategory.name} onChange={handleUpdateChange} />
                        <input name="imageFile" type="file" accept="image/*" onChange={handleUpdateChange} />
                        <div className="modal-actions">
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setEditCategory(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this category?</p>
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
                            <th>Name</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c, index) => (
                            <tr key={index}>
                                <td style={{ width: "20px" }}>{c.id}</td>
                                <td>{c.name}</td>
                                <td><img src={`https://localhost:7279/${c.imageUrl}`} alt={c.name} style={{ width: "50px", height: "auto" }} /></td>
                                <td>
                                    <div className="btns">
                                        <button className="edit-btn" onClick={() => setEditCategory({ ...c, id: c.id })}>Edit</button>
                                        <button className="delete-btn" onClick={() => confirmDelete(c.id)}>Delete</button>
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

export default Category;
