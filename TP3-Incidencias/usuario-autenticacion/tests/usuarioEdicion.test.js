const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

beforeEach(async () => {
    await db.query("DELETE FROM Usuario");
});

describe("Pruebas de edición de perfil", () => {
    test("Editar con contraseña de 6 caracteres → 400 CONTRASEÑA_INVALIDA", async () => {
        const regResponse = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "test@test.com", password: "Test1234", nombre: "Test", apellido: "User" });

        const loginResponse = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "test@test.com", password: "Test1234" });

        const response = await request(app)
            .put(`/api/v1/usuarios/${regResponse.body.id_usuario}`)
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({ nombre: "Test", apellido: "User", password: "Ab1" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("CONTRASEÑA_INVALIDA");
    });

    test("Editar perfil de otro usuario → 403 NO_AUTORIZADO", async () => {
        await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "user1@test.com", password: "Test1234", nombre: "User1", apellido: "Test" });

        const loginResponse = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "user2@test.com", password: "Test1234", nombre: "User2", apellido: "Test" });

        const response = await request(app)
            .put("/api/v1/usuarios/999")
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({ nombre: "Hacker", apellido: "User" });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("NO_AUTORIZADO");
    });

    test("Edición exitosa → 200 Perfil actualizado", async () => {
        const regResponse = await request(app)
            .post("/api/v1/usuarios/registro")
            .send({ email: "editar@test.com", password: "Test1234", nombre: "Original", apellido: "User" });

        const loginResponse = await request(app)
            .post("/api/v1/usuarios/login")
            .send({ email: "editar@test.com", password: "Test1234" });

        const response = await request(app)
            .put(`/api/v1/usuarios/${regResponse.body.id_usuario}`)
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({ nombre: "Actualizado", apellido: "User" });

        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe("Perfil actualizado");
    });
});
