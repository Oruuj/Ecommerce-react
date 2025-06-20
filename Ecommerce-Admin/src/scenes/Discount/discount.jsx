import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "./discount.css";

const Discount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [newDiscount, setNewDiscount] = useState({
        name: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
    });
    const [editDiscount, setEditDiscount] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [assignDiscount, setAssignDiscount] = useState({ productId: "", discountId: "" });
    const [showAssign, setShowAssign] = useState(false);

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const res = await axios.get("/Discount/UI/GetAll");
            setDiscounts(res.data);
        } catch {
            toast.error("Failed to fetch discounts");
        }
    };

    const handleCreateChange = (e) => {
        setNewDiscount({ ...newDiscount, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/Discount/Admin/Create", {
                Name: newDiscount.name,
                DiscountPercentage: parseFloat(newDiscount.discountPercentage),
                StartDate: newDiscount.startDate,
                EndDate: newDiscount.endDate,
            });

            toast.success("Discount created");
            setNewDiscount({ name: "", discountPercentage: "", startDate: "", endDate: "" });
            setShowCreate(false);
            fetchDiscounts();
        } catch (err) {
            toast.error("Failed to create discount");
            console.error(err.response?.data || err.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put("/Discount/Admin/Update", {
                Id: editDiscount.id,
                Name: editDiscount.name,
                DiscountPercentage: parseFloat(editDiscount.discountPercentage),
                StartDate: editDiscount.startDate,
                EndDate: editDiscount.endDate,
            });

            toast.success("Discount updated");
            setEditDiscount(null);
            fetchDiscounts();
        } catch (err) {
            toast.error("Failed to update discount");
            console.error(err.response?.data || err.message);
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/Discount/Admin/Delete/${deleteId}`);
            toast.success("Discount deleted");
            fetchDiscounts();
        } catch {
            toast.error("Failed to delete");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/Discount/Admin/AddtoProduct", {
                ProductId: parseInt(assignDiscount.productId, 10),
                DiscountId: parseInt(assignDiscount.discountId, 10),
            });

            toast.success("Discount assigned to product");
            setAssignDiscount({ productId: "", discountId: "" });
            setShowAssign(false);
        } catch (err) {
            toast.error("Failed to assign discount");
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className="container">
            <div className="create-btn">
                <button onClick={() => setShowCreate(true)}>Create Discount</button>
                <button onClick={() => setShowAssign(true)}>Assign Discount to Product</button>
            </div>

            {showCreate && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleCreateSubmit}>
                        <h3>Create Discount</h3>
                        <input name="name" placeholder="Name" value={newDiscount.name} onChange={handleCreateChange} required />
                        <input name="discountPercentage" type="number" placeholder="Discount %" value={newDiscount.discountPercentage} onChange={handleCreateChange} required />
                        <input name="startDate" type="date" value={newDiscount.startDate} onChange={handleCreateChange} required />
                        <input name="endDate" type="date" value={newDiscount.endDate} onChange={handleCreateChange} required />
                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {editDiscount && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleUpdateSubmit}>
                        <h3>Edit Discount</h3>
                        <input name="name" placeholder="Name" value={editDiscount.name} onChange={(e) => setEditDiscount({ ...editDiscount, name: e.target.value })} required />
                        <input name="discountPercentage" type="number" placeholder="Discount %" value={editDiscount.discountPercentage} onChange={(e) => setEditDiscount({ ...editDiscount, discountPercentage: e.target.value })} required />
                        <input name="startDate" type="date" value={editDiscount.startDate} onChange={(e) => setEditDiscount({ ...editDiscount, startDate: e.target.value })} required />
                        <input name="endDate" type="date" value={editDiscount.endDate} onChange={(e) => setEditDiscount({ ...editDiscount, endDate: e.target.value })} required />
                        <div className="modal-actions">
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setEditDiscount(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {showAssign && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleAssignSubmit}>
                        <h3>Assign Discount to Product</h3>
                        <input
                            name="productId"
                            type="number"
                            placeholder="Product ID"
                            value={assignDiscount.productId}
                            onChange={(e) => setAssignDiscount({ ...assignDiscount, productId: e.target.value })}
                            required
                        />
                        <select
                            value={assignDiscount.discountId}
                            onChange={(e) => setAssignDiscount({ ...assignDiscount, discountId: e.target.value })}
                            required
                        >
                            <option value="">Select Discount</option>
                            {discounts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} - {d.discountPercentage}%
                                </option>
                            ))}
                        </select>
                        <div className="modal-actions">
                            <button type="submit">Assign</button>
                            <button type="button" onClick={() => setShowAssign(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this discount?</p>
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
                            <th>Discount %</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map((d) => (
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>{d.name}</td>
                                <td>{d.discountPercentage}%</td>
                                <td>{new Date(d.startDate).toLocaleDateString()}</td>
                                <td>{new Date(d.endDate).toLocaleDateString()}</td>
                                <td>
                                    <div className="btns">
                                        <button className="edit-btn" onClick={() => setEditDiscount(d)}>Edit</button>
                                        <button className="delete-btn" onClick={() => confirmDelete(d.id)}>Delete</button>
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

export default Discount;
