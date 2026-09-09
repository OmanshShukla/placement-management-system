import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Invalid email or password"
                );

            } else {

                alert(
                    "Backend server is not running"
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-icon">
                    🎓
                </div>

                <h1>
                    Placement Management System
                </h1>

                <p className="login-subtitle">
                    Sign in to manage your placement activities.
                </p>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                <p className="login-footer">
                    Placement Management Portal
                </p>

            </div>

        </div>
    );
}

export default Login;