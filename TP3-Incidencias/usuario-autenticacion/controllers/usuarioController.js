const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "escuchify_secret_key_2026";

const registro = async (req, res) => {
    try {
        const { email, password, nombre, apellido } = req.body;

        const [existentes] = await db.query("SELECT id_usuario FROM Usuario WHERE email = ?", [email]);
        if (existentes.length > 0) {
            return res.status(409).json({ error: "EMAIL_DUPLICADO", message: "El email ya está registrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            "INSERT INTO Usuario (email, password_hash, nombre, apellido) VALUES (?, ?, ?, ?)",
            [email, password_hash, nombre, apellido]
        );

        res.status(201).json({ id_usuario: result.insertId, email });
    } catch (error) {
        res.status(500).json({ error: "ERROR_INTERNO", message: "Error al registrar usuario" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [usuarios] = await db.query("SELECT id_usuario, email, password_hash FROM Usuario WHERE email = ?", [email]);
        if (usuarios.length === 0) {
            return res.status(401).json({ error: "CREDENCIALES_INVALIDAS", message: "Email o contraseña incorrectos" });
        }

        const usuario = usuarios[0];
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: "CREDENCIALES_INVALIDAS", message: "Email o contraseña incorrectos" });
        }

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, email: usuario.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ token, id_usuario: usuario.id_usuario });
    } catch (error) {
        res.status(500).json({ error: "ERROR_INTERNO", message: "Error al iniciar sesión" });
    }
};

const obtenerPerfil = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const [usuarios] = await db.query(
            "SELECT id_usuario, email, nombre, apellido, fecha_registro FROM Usuario WHERE id_usuario = ?",
            [id_usuario]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ error: "NO_ENCONTRADO", message: "Usuario no encontrado" });
        }

        res.status(200).json(usuarios[0]);
    } catch (error) {
        res.status(500).json({ error: "ERROR_INTERNO", message: "Error al obtener perfil" });
    }
};

const editarPerfil = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const tokenId = req.usuario.id_usuario;

        if (parseInt(id_usuario) !== tokenId) {
            return res.status(403).json({ error: "NO_AUTORIZADO", message: "No tienes permiso para editar este perfil" });
        }

        const [usuarios] = await db.query("SELECT id_usuario FROM Usuario WHERE id_usuario = ?", [id_usuario]);
        if (usuarios.length === 0) {
            return res.status(404).json({ error: "NO_ENCONTRADO", message: "Usuario no encontrado" });
        }

        const { nombre, apellido, password } = req.body;
        let updateQuery = "UPDATE Usuario SET nombre = ?, apellido = ?";
        const params = [nombre, apellido];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            updateQuery += ", password_hash = ?";
            params.push(password_hash);
        }

        updateQuery += " WHERE id_usuario = ?";
        params.push(parseInt(id_usuario));

        await db.query(updateQuery, params);

        res.status(200).json({ mensaje: "Perfil actualizado" });
    } catch (error) {
        res.status(500).json({ error: "ERROR_INTERNO", message: "Error al editar perfil" });
    }
};

module.exports = { registro, login, obtenerPerfil, editarPerfil };
