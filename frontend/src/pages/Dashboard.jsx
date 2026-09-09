import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let role = "";

    if (token) {
        try {
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            role = payload.role;

        } catch (error) {
            console.error("Invalid token");
        }
    }

    const isAdmin =
        role === "ADMIN" ||
        role === "ROLE_ADMIN";

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (
        <div className="dashboard-page">

            {/* Header */}

            <div className="dashboard-header">

                <div>
                    <h1>
                        Placement Management System
                    </h1>

                    <p className="dashboard-subtitle">
                        Manage placements, drives,
                        students and applications.
                    </p>
                </div>

                <div className="user-section">

                    <span className="role-badge">
                        {isAdmin
                            ? "ADMIN"
                            : "STUDENT"}
                    </span>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* Welcome Section */}

            <div className="welcome-section">

                <h2>
                    Welcome back 👋
                </h2>

                <p>
                    You are logged in as{" "}
                    <strong>
                        {isAdmin
                            ? "Administrator"
                            : "Student"}
                    </strong>
                    .
                </p>

            </div>

            {/* Management Modules */}

            <div className="modules-section">

                <h2>
                    Management Modules
                </h2>

                <div className="module-grid">

                    {/* Companies */}

                    <div
                        className="module-card"
                        onClick={() =>
                            navigate("/companies")
                        }
                    >
                        <div className="module-icon">
                            🏢
                        </div>

                        <h3>
                            Companies
                        </h3>

                        <p>
                            View and manage
                            recruiting companies.
                        </p>

                        <button>
                            Open Companies →
                        </button>
                    </div>

                    {/* Placement Drives */}

                    <div
                        className="module-card"
                        onClick={() =>
                            navigate("/drives")
                        }
                    >
                        <div className="module-icon">
                            💼
                        </div>

                        <h3>
                            Placement Drives
                        </h3>

                        <p>
                            Explore and manage
                            upcoming placement drives.
                        </p>

                        <button>
                            Open Drives →
                        </button>
                    </div>

                    {/* Students */}

                    {isAdmin && (

                        <div
                            className="module-card"
                            onClick={() =>
                                navigate("/students")
                            }
                        >
                            <div className="module-icon">
                                🎓
                            </div>

                            <h3>
                                Students
                            </h3>

                            <p>
                                Manage registered
                                placement students.
                            </p>

                            <button>
                                Open Students →
                            </button>
                        </div>

                    )}

                    {/* Applications */}

                    <div
                        className="module-card"
                        onClick={() =>
                            navigate("/applications")
                        }
                    >
                        <div className="module-icon">
                            📋
                        </div>

                        <h3>
                            Applications
                        </h3>

                        <p>
                            Track placement
                            applications and status.
                        </p>

                        <button>
                            Open Applications →
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;