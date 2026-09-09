import { useEffect, useState } from "react";
import axios from "axios";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
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

            const userRole = payload.role;
            setRole(userRole);

            const endpoint =
                userRole === "ADMIN" || userRole === "ROLE_ADMIN"
                    ? "http://localhost:8080/applications"
                    : "http://localhost:8080/applications/my";

            const response = await axios.get(
                endpoint,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setApplications(response.data);

        } catch (err) {
            console.error(
                "Error fetching applications:",
                err
            );

            if (err.response?.status === 403) {
                setError(
                    "Access denied. You do not have permission."
                );
            } else if (err.response) {
                setError(
                    `Server error: ${err.response.status}`
                );
            } else {
                setError(
                    "Network error. Backend server is not reachable."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
        applicationId,
        newStatus
    ) => {
        try {
            setUpdatingId(applicationId);

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/applications/${applicationId}/status`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            alert(
                "Application status updated successfully!"
            );

            await fetchApplications();

        } catch (err) {
            console.error(
                "Error updating application status:",
                err
            );

            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert(
                    "Unable to update application status."
                );
            }
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <h2>Loading applications...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const isAdmin =
        role === "ADMIN" || role === "ROLE_ADMIN";

    return (
        <div>
            <h1>Applications</h1>

            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Drive</th>
                            <th>Company</th>
                            <th>Status</th>

                            {isAdmin && (
                                <th>Update Status</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.id}>

                                <td>
                                    {application.id}
                                </td>

                                <td>
                                    {application.student
                                        ? application.student.name
                                        : "N/A"}
                                </td>

                                <td>
                                    {application.placementDrive
                                        ? application.placementDrive.driveTitle
                                        : "N/A"}
                                </td>

                                <td>
                                    {application.placementDrive?.company
                                        ? application.placementDrive.company.companyName
                                        : "N/A"}
                                </td>

                                <td>
                                    {application.status}
                                </td>

                                {isAdmin && (
                                    <td>
                                        <select
                                            defaultValue={
                                                application.status
                                            }
                                            disabled={
                                                updatingId ===
                                                application.id
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    application.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="APPLIED">
                                                APPLIED
                                            </option>

                                            <option value="SHORTLISTED">
                                                SHORTLISTED
                                            </option>

                                            <option value="SELECTED">
                                                SELECTED
                                            </option>

                                            <option value="REJECTED">
                                                REJECTED
                                            </option>
                                        </select>
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

export default Applications;