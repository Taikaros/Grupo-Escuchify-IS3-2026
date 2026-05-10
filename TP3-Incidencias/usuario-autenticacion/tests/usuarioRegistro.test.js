const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

beforeEach(async () => {
    await db.query("DELETE FROM Usuario");
});

describe("POST /api/v1/usuarios/registro", () => {
    test("Registrar con email duplicado → 400 EMAIL_DUPLICADO", async () => {
        await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "test@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        const response = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "test@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        expect(response.status).toBe(409);
        expect(response.body.error).toBe("EMAIL_DUPLICADO");
    });

    test("Registrar con contraseña de 6 caracteres → 400 CONTRASEÑA_INVALIDA", async () => {
        const response = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "test@test.com", password: "Ab1", nombre: "Test", apellido: "User" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("CONTRASEÑA_INVALIDA");
    });

    test("Registro exitoso → 201 con id_usuario y email", async () => {
        const response = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "test@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id_usuario");
        expect(response.body.email).toBe("test@test.com");
    });
});
