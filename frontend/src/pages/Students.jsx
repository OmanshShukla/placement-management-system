import { useEffect, useState } from "react";
import axios from "axios";

function Students() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/students",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStudents(response.data);

        } catch (err) {

            console.error(
                "Error fetching students:",
                err
            );

            if (err.response?.status === 403) {
                setError(
                    "Access denied. Admin access is required."
                );
            } else {
                setError(
                    "Unable to load students."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const handleInputChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {

        setEditingStudent(null);

        setFormData({
            name: "",
            email: "",
            phone: ""
        });

        setShowForm(true);
    };

    const openEditForm = (student) => {

        setEditingStudent(student);

        setFormData({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const studentData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };

            if (editingStudent) {

                await axios.put(
                    `http://localhost:8080/students/${editingStudent.id}`,
                    studentData,
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
                    "Student updated successfully!"
                );

            } else {

                await axios.post(
                    "http://localhost:8080/students",
                    studentData,
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
                    "Student added successfully!"
                );
            }

            setShowForm(false);
            setEditingStudent(null);

            await loadStudents();

        } catch (err) {

            console.error(
                "Error saving student:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to save student."
                );
            }
        }
    };

    const handleDelete = async (studentId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/students/${studentId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Student deleted successfully!"
            );

            await loadStudents();

        } catch (err) {

            console.error(
                "Error deleting student:",
                err
            );

            if (err.response?.data?.message) {
                alert(
                    err.response.data.message
                );
            } else {
                alert(
                    "Unable to delete student."
                );
            }
        }
    };

    if (loading) {
        return <h2>Loading students...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>Students</h1>

            <button onClick={openAddForm}>
                + Add Student
            </button>

            <br />
            <br />

            {showForm && (

                <div>

                    <h2>
                        {editingStudent
                            ? "Edit Student"
                            : "Add Student"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div>
                            <label>
                                Name
                            </label>
                            <br />

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Enter student name"
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
                                value={formData.email}
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Enter student email"
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
                                value={formData.phone}
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <br />

                        <button type="submit">
                            {editingStudent
                                ? "Update Student"
                                : "Add Student"}
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

            {students.length === 0 ? (

                <p>No students found.</p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                >

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {students.map((student) => (

                            <tr key={student.id}>

                                <td>
                                    {student.id}
                                </td>

                                <td>
                                    {student.name}
                                </td>

                                <td>
                                    {student.email}
                                </td>

                                <td>
                                    {student.phone}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            openEditForm(
                                                student
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                student.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Students;