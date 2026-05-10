const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

beforeEach(async () => {
    await db.query("DELETE FROM Usuario");
});

describe("Verificación de criterios de aceptación", () => {
    test("HU1: Registro con email válido y contraseña segura, email único", async () => {
        const response = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "hu1@test.com", password: "Secure123", nombre: "HU1", apellido: "Test" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id_usuario");
        expect(response.body.email).toBe("hu1@test.com");

        const duplicado = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "hu1@test.com", password: "Secure123", nombre: "HU1", apellido: "Test" });

        expect(duplicado.status).toBe(409);
    });

    test("HU2: Login genera token, redirige a dashboard", async () => {
        await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "hu2@test.com", password: "Secure123", nombre: "HU2", apellido: "Test" });

        const login = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "hu2@test.com", password: "Secure123" });

        expect(login.status).toBe(200);
        expect(login.body).toHaveProperty("token");
        expect(login.body).toHaveProperty("id_usuario");
    });

    test("HU3: Edición de nombre, apellido y contraseña validada", async () => {
        const reg = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "hu3@test.com", password: "Secure123", nombre: "Original", apellido: "Test" });

        const login = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "hu3@test.com", password: "Secure123" });

        const edit = await request(app)
            .put(`/api/v1/usuarios/${reg.body.id_usuario}`)
            .set("Authorization", `Bearer ${login.body.token}`)
            .send({ nombre: "Editado", apellido: "Test", password: "NewSecure456" });

        expect(edit.status).toBe(200);
        expect(edit.body.mensaje).toBe("Perfil actualizado");
    });
});
