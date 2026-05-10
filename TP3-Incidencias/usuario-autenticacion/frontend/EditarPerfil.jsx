import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const EditarPerfil = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const idUsuario = localStorage.getItem("id_usuario");
                const response = await api.get(`/api/v1/usuarios/${idUsuario}`);
                setFormData({
                    nombre: response.data.nombre,
                    apellido: response.data.apellido,
                    password: ""
                });
            } catch (err) {
                setError("Error al cargar perfil");
            }
        };
        cargarPerfil();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const idUsuario = localStorage.getItem("id_usuario");
            const payload = { nombre: formData.nombre, apellido: formData.apellido };
            if (formData.password) {
                payload.password = formData.password;
            }

            await api.put(`/api/v1/usuarios/${idUsuario}`, payload);
            setUser({ ...user, nombre: formData.nombre, apellido: formData.apellido });
            setSuccess("Perfil actualizado correctamente");
            setFormData({ ...formData, password: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar perfil");
        }
    };

    return (
        <div className="editar-perfil-container">
            <h2>Editar Perfil</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
                <input name="password" type="password" placeholder="Nueva contraseña (opcional)" value={formData.password} onChange={handleChange} />
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarPerfil;
