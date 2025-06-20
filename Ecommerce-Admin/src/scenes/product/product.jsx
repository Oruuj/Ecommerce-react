import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./product.css";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editProduct, setEditProduct] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        brand: "",
        stockQuantity: "",
        categoryId: "",
        images: [],
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/Product/UI/GetAllWithInclude");
            setProducts(res.data);
        } catch (err) {
            toast.error("Failed to fetch products");
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Product/Admin/Delete?id=${deleteId}`);
            setProducts(products.filter((p) => p.id !== deleteId));
            toast.success("Product deleted successfully!");
        } catch (err) {
            toast.error("Failed to delete product.");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    const handleCreateChange = (e) => {
        setNewProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Name", newProduct.name);
        formData.append("Description", newProduct.description);
        formData.append("Price", newProduct.price);
        formData.append("Brand", newProduct.brand);
        formData.append("StockQuantity", newProduct.stockQuantity);
        formData.append("CategoryId", newProduct.categoryId);

        for (const file of newProduct.images) {
            formData.append("Images", file);
        }

        try {
            await axios.post("/Product/Admin/Create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Product created successfully!");
            setShowCreate(false);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                brand: "",
                stockQuantity: "",
                categoryId: "",
                images: [],
            });
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create product.");
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Id", editProduct.id);
        formData.append("Name", editProduct.name || "");
        formData.append("Description", editProduct.description || "");
        formData.append("Price", editProduct.price);
        formData.append("Brand", editProduct.brand || "");
        formData.append("StockQuantity", editProduct.stockQuantity);
        formData.append("CategoryId", editProduct.categoryId);

        if (editProduct.images && editProduct.images.length > 0) {
            for (const file of editProduct.images) {
                formData.append("Images", file);
            }
        }

        try {
            await axios.put("/Product/Admin/Update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Product updated successfully!");
            setEditProduct(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update product.");
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create</button>
            </div>

            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit}>
                        <h3>Create New Product</h3>
                        <input name="name" placeholder="Name" value={newProduct.name} onChange={handleCreateChange} required />
                        <input name="description" placeholder="Description" value={newProduct.description} onChange={handleCreateChange} required />
                        <input name="price" type="number" step="0.01" placeholder="Price" value={newProduct.price} onChange={handleCreateChange} required />
                        <input name="brand" placeholder="Brand" value={newProduct.brand} onChange={handleCreateChange} required />
                        <input name="stockQuantity" type="number" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={handleCreateChange} required />
                        <input name="categoryId" type="number" placeholder="Category ID" value={newProduct.categoryId} onChange={handleCreateChange} required />
                        <input type="file" name="images" multiple accept="image/*" onChange={(e) => setNewProduct((prev) => ({ ...prev, images: Array.from(e.target.files) }))} required />
                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {editProduct && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleUpdateSubmit}>
                        <h3>Update Product</h3>
                        <input name="name" placeholder="Name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                        <input name="description" placeholder="Description" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                        <input name="price" type="number" step="0.01" placeholder="Price" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
                        <input name="brand" placeholder="Brand" value={editProduct.brand} onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })} />
                        <input name="stockQuantity" type="number" placeholder="Stock Quantity" value={editProduct.stockQuantity} onChange={(e) => setEditProduct({ ...editProduct, stockQuantity: e.target.value })} />
                        <input name="categoryId" type="number" placeholder="Category ID" value={editProduct.categoryId} onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })} />
                        <input type="file" name="images" multiple accept="image/*" onChange={(e) => setEditProduct({ ...editProduct, images: Array.from(e.target.files) })} />
                        <div className="modal-actions">
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this product?</p>
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
                            <th>Description</th>
                            <th>Price</th>
                            <th>Brand</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>${p.price}</td>
                                <td>{p.brand}</td>
                                <td>{p.stockQuantity}</td>
                                <td>{p.category?.name}</td>
                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => setEditProduct(p)}>Edit</button>
                                    <button className="delete-btn" onClick={() => confirmDelete(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Product;
