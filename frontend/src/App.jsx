import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import PlacementDrives from "./pages/PlacementDrives";
import Students from "./pages/Students";
import Applications from "./pages/Applications";

function App() {
    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>

                {/* Home */}
                <Route
                    path="/"
                    element={
                        token
                            ? <Navigate to="/dashboard" />
                            : <Navigate to="/login" />
                    }
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        token
                            ? <Dashboard />
                            : <Navigate to="/login" />
                    }
                />

                {/* Companies */}
                <Route
                    path="/companies"
                    element={
                        token
                            ? <Companies />
                            : <Navigate to="/login" />
                    }
                />

                {/* Placement Drives */}
                <Route
                    path="/drives"
                    element={
                        token
                            ? <PlacementDrives />
                            : <Navigate to="/login" />
                    }
                />

                {/* Students */}
                <Route
                    path="/students"
                    element={
                        token
                            ? <Students />
                            : <Navigate to="/login" />
                    }
                />

                {/* Applications */}
                <Route
                    path="/applications"
                    element={
                        token
                            ? <Applications />
                            : <Navigate to="/login" />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;