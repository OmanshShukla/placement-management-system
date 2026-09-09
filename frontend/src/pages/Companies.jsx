import { useEffect, useState } from "react";
import axios from "axios";

function Companies() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [role, setRole] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const [formData, setFormData] = useState({
        companyName: "",
        hrName: "",
        email: "",
        phone: "",
        location: "",
        packageOffered: "",
        minimumCgpa: ""
    });

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {

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
                "http://localhost:8080/companies",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCompanies(response.data);

        } catch (err) {

            console.error(
                "Error fetching companies:",
                err
            );

            if (err.response?.status === 403) {
                setError(
                    "Access denied. You do not have permission."
                );
            } else {
                setError(
                    "Unable to load companies."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const isAdmin =
        role === "ADMIN" ||
        role === "ROLE_ADMIN";

    const handleInputChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {

        setEditingCompany(null);

        setFormData({
            companyName: "",
            hrName: "",
            email: "",
            phone: "",
            location: "",
            packageOffered: "",
            minimumCgpa: ""
        });

        setShowForm(true);
    };

    const openEditForm = (company) => {

        setEditingCompany(company);

        setFormData({
            companyName: company.companyName || "",
            hrName: company.hrName || "",
            email: company.email || "",
            phone: company.phone || "",
            location: company.location || "",
            packageOffered:
                company.packageOffered ?? "",
            minimumCgpa:
                company.minimumCgpa ?? ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const companyData = {
                companyName: formData.companyName,
                hrName: formData.hrName,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                packageOffered:
                    Number(formData.packageOffered),
                minimumCgpa:
                    Number(formData.minimumCgpa)
            };

            if (editingCompany) {

                await axios.put(
                    `http://localhost:8080/companies/${editingCompany.id}`,
                    companyData,
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
                    "Company updated successfully!"
                );

            } else {

                await axios.post(
                    "http://localhost:8080/companies",
                    companyData,
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
                    "Company added successfully!"
                );
            }

            setShowForm(false);
            setEditingCompany(null);

            await loadCompanies();

        } catch (err) {

            console.error(
                "Error saving company:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to save company."
                );
            }
        }
    };

    const handleDelete = async (companyId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this company?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/companies/${companyId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Company deleted successfully!"
            );

            await loadCompanies();

        } catch (err) {

            console.error(
                "Error deleting company:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to delete company."
                );
            }
        }
    };

    if (loading) {
        return <h2>Loading companies...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>Companies</h1>

            {isAdmin && (
                <button onClick={openAddForm}>
                    + Add Company
                </button>
            )}

            <br />
            <br />

            {showForm && isAdmin && (

                <div>

                    <h2>
                        {editingCompany
                            ? "Edit Company"
                            : "Add Company"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div>
                            <label>
                                Company Name
                            </label>
                            <br />

                            <input
                                type="text"
                                name="companyName"
                                value={
                                    formData.companyName
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
                                HR Name
                            </label>
                            <br />

                            <input
                                type="text"
                                name="hrName"
                                value={
                                    formData.hrName
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
                                Email
                            </label>
                            <br />

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
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
                                Phone
                            </label>
                            <br />

                            <input
                                type="text"
                                name="phone"
                                value={
                                    formData.phone
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
                                Location
                            </label>
                            <br />

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
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
                                Package Offered
                            </label>
                            <br />

                            <input
                                type="number"
                                step="0.1"
                                name="packageOffered"
                                value={
                                    formData.packageOffered
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

                        <button type="submit">
                            {editingCompany
                                ? "Update Company"
                                : "Add Company"}
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

            {companies.length === 0 ? (

                <p>No companies found.</p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                >

                    <thead>
                        <tr>

                            <th>ID</th>
                            <th>Company Name</th>
                            <th>HR Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Package</th>
                            <th>Minimum CGPA</th>

                            {isAdmin && (
                                <th>Actions</th>
                            )}

                        </tr>
                    </thead>

                    <tbody>

                        {companies.map((company) => (

                            <tr key={company.id}>

                                <td>
                                    {company.id}
                                </td>

                                <td>
                                    {company.companyName}
                                </td>

                                <td>
                                    {company.hrName}
                                </td>

                                <td>
                                    {company.email}
                                </td>

                                <td>
                                    {company.phone}
                                </td>

                                <td>
                                    {company.location}
                                </td>

                                <td>
                                    {company.packageOffered}
                                </td>

                                <td>
                                    {company.minimumCgpa}
                                </td>

                                {isAdmin && (

                                    <td>

                                        <button
                                            onClick={() =>
                                                openEditForm(
                                                    company
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    company.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                )}

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Companies;