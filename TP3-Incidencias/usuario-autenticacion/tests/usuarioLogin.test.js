const request = require("supertest");
const app = require("../app");
const db = require("../config/database");
const bcrypt = require("bcrypt");

beforeEach(async () => {
    await db.query("DELETE FROM Usuario");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("Test1234", salt);
    await db.query(
        "INSERT INTO Usuario (email, password_hash, nombre, apellido) VALUES (?, ?, ?, ?)",
        ["test@test.com", hash, "Test", "User"]
    );
});

describe("POST /api/v1/usuarios/login", () => {
    test("Login con credenciales incorrectas → 401 CREDENCIALES_INVALIDAS", async () => {
        const response = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "test@test.com", password: "WrongPass1" });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("CREDENCIALES_INVALIDAS");
    });

    test("Login con usuario no existente → 401 CREDENCIALES_INVALIDAS", async () => {
        const response = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "noexiste@test.com", password: "Test1234" });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("CREDENCIALES_INVALIDAS");
    });

    test("Login exitoso → 200 con token y id_usuario", async () => {
        const response = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "test@test.com", password: "Test1234" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("id_usuario");
    });
});
