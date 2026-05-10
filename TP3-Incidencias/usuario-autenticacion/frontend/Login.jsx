import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/v1/usuarios/login", formData);
            const { token, id_usuario } = response.data;
            login(token, id_usuario);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
        </div>
    );
};

export default Login;
