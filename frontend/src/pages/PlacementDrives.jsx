import { useEffect, useState } from "react";
import axios from "axios";

function PlacementDrives() {

    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [role, setRole] = useState("");

    const [applyingDriveId, setApplyingDriveId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);

    const [formData, setFormData] = useState({
        driveTitle: "",
        driveDate: "",
        venue: "",
        lastDateToApply: "",
        minimumCgpa: "",
        companyId: ""
    });

    useEffect(() => {
        loadDrives();
    }, []);

    const loadDrives = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first.");
                setLoading(false);
                return;
            }

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            setRole(payload.role);

            const response = await axios.get(
                "http://localhost:8080/drives",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDrives(response.data);

        } catch (err) {

            console.error(
                "Error fetching drives:",
                err
            );

            if (err.response?.status === 403) {
                setError(
                    "Access denied. You do not have permission."
                );
            } else {
                setError(
                    "Unable to load placement drives."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const isAdmin =
        role === "ADMIN" ||
        role === "ROLE_ADMIN";

    const handleApply = async (driveId) => {

        try {

            setApplyingDriveId(driveId);

            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:8080/applications/apply/${driveId}`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Application submitted successfully!"
            );

        } catch (err) {

            console.error(
                "Error applying for drive:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to apply for this placement drive."
                );
            }

        } finally {

            setApplyingDriveId(null);
        }
    };

    const handleInputChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {

        setEditingDrive(null);

        setFormData({
            driveTitle: "",
            driveDate: "",
            venue: "",
            lastDateToApply: "",
            minimumCgpa: "",
            companyId: ""
        });

        setShowForm(true);
    };

    const openEditForm = (drive) => {

        setEditingDrive(drive);

        setFormData({
            driveTitle: drive.driveTitle || "",
            driveDate: drive.driveDate || "",
            venue: drive.venue || "",
            lastDateToApply:
                drive.lastDateToApply || "",
            minimumCgpa:
                drive.minimumCgpa ?? "",
            companyId:
                drive.company?.id ?? ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const driveData = {
                driveTitle: formData.driveTitle,
                driveDate: formData.driveDate,
                venue: formData.venue,
                lastDateToApply:
                    formData.lastDateToApply,
                minimumCgpa:
                    Number(formData.minimumCgpa),
                company: {
                    id: Number(formData.companyId)
                }
            };

            if (editingDrive) {

                await axios.put(
                    `http://localhost:8080/drives/${editingDrive.id}`,
                    driveData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                alert(
                    "Placement drive updated successfully!"
                );

            } else {

                await axios.post(
                    "http://localhost:8080/drives",
                    driveData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                alert(
                    "Placement drive added successfully!"
                );
            }

            setShowForm(false);
            setEditingDrive(null);

            await loadDrives();

        } catch (err) {

            console.error(
                "Error saving placement drive:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to save placement drive."
                );
            }
        }
    };

    const handleDelete = async (driveId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this placement drive?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/drives/${driveId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Placement drive deleted successfully!"
            );

            await loadDrives();

        } catch (err) {

            console.error(
                "Error deleting placement drive:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to delete placement drive."
                );
            }
        }
    };

    if (loading) {
        return <h2>Loading placement drives...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>Placement Drives</h1>

            {isAdmin && (
                <button onClick={openAddForm}>
                    + Add Placement Drive
                </button>
            )}

            <br />
            <br />

            {showForm && isAdmin && (

                <div>

                    <h2>
                        {editingDrive
                            ? "Edit Placement Drive"
                            : "Add Placement Drive"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div>
                            <label>
                                Drive Title
                            </label>
                            <br />

                            <input
                                type="text"
                                name="driveTitle"
                                value={
                                    formData.driveTitle
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Drive Date
                            </label>
                            <br />

                            <input
                                type="date"
                                name="driveDate"
                                value={
                                    formData.driveDate
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Venue
                            </label>
                            <br />

                            <input
                                type="text"
                                name="venue"
                                value={
                                    formData.venue
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Last Date to Apply
                            </label>
                            <br />

                            <input
                                type="date"
                                name="lastDateToApply"
                                value={
                                    formData.lastDateToApply
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Minimum CGPA
                            </label>
                            <br />

                            <input
                                type="number"
                                step="0.1"
                                name="minimumCgpa"
                                value={
                                    formData.minimumCgpa
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Company ID
                            </label>
                            <br />

                            <input
                                type="number"
                                name="companyId"
                                value={
                                    formData.companyId
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Example: 1"
                                required
                            />
                        </div>

                        <br />

                        <button type="submit">
                            {editingDrive
                                ? "Update Drive"
                                : "Add Drive"}
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={() =>
                                setShowForm(false)
                            }
                        >
                            Cancel
                        </button>

                    </form>

                    <hr />

                </div>
            )}

            {drives.length === 0 ? (

                <p>No placement drives found.</p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                >

                    <thead>
                        <tr>

                            <th>ID</th>
                            <th>Drive Title</th>
                            <th>Company</th>
                            <th>Drive Date</th>
                            <th>Venue</th>
                            <th>Last Date to Apply</th>
                            <th>Minimum CGPA</th>

                            {isAdmin ? (
                                <th>Actions</th>
                            ) : (
                                <th>Action</th>
                            )}

                        </tr>
                    </thead>

                    <tbody>

                        {drives.map((drive) => (

                            <tr key={drive.id}>

                                <td>
                                    {drive.id}
                                </td>

                                <td>
                                    {drive.driveTitle}
                                </td>

                                <td>
                                    {drive.company
                                        ? drive.company.companyName
                                        : "N/A"}
                                </td>

                                <td>
                                    {drive.driveDate}
                                </td>

                                <td>
                                    {drive.venue}
                                </td>

                                <td>
                                    {drive.lastDateToApply}
                                </td>

                                <td>
                                    {drive.minimumCgpa}
                                </td>

                                <td>

                                    {isAdmin ? (

                                        <>
                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        drive
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {" "}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        drive.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                handleApply(
                                                    drive.id
                                                )
                                            }
                                            disabled={
                                                applyingDriveId ===
                                                drive.id
                                            }
                                        >
                                            {applyingDriveId ===
                                            drive.id
                                                ? "Applying..."
                                                : "Apply"}
                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default PlacementDrives;