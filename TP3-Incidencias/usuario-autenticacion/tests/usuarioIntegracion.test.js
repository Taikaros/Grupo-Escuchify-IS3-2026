const request = require("supertest");
const app = require("../app");
const db = require("../config/database");
const bcrypt = require("bcrypt");

beforeEach(async () => {
    await db.query("DELETE FROM Usuario");
});

describe("Pruebas de integración - BD", () => {
    test("Usuario insertado tiene password hasheado, no texto plano (RN3)", async () => {
        await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "test@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        const [usuarios] = await db.query("SELECT password_hash FROM Usuario WHERE email = ?", ["test@test.com"]);
        expect(usuarios[0].password_hash).not.toBe("Test1234");
        expect(usuarios[0].password_hash).toContain("$2b$");
    });

    test("Email único se respeta en BD (RN1)", async () => {
        await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "unico@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        const response = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "unico@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        expect(response.status).toBe(409);
    });

    test("Edición de perfil actualiza datos correctamente", async () => {
        const regResponse = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "editar@test.com", password: "Test1234", nombre: "Original", apellido: "User" });

        const idUsuario = regResponse.body.id_usuario;
        const loginResponse = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "editar@test.com", password: "Test1234" });

        const token = loginResponse.body.token;

        const putResponse = await request(app)
            .put(`/api/v1/usuarios/${idUsuario}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ nombre: "Actualizado", apellido: "User" });

        expect(putResponse.status).toBe(200);
        expect(putResponse.body.mensaje).toBe("Perfil actualizado");
    });
});
