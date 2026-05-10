const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "escuchify_secret_key_2026";

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "NO_AUTENTICADO", message: "Token de acceso requerido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "TOKEN_INVALIDO", message: "Token inválido o expirado" });
    }
};

module.exports = verificarToken;
