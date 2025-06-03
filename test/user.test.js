// test/user.test.js
const request = require("supertest");
const server = require("../server"); // tu server.js

describe("User endpoints", () => {
  const testUser = {
    nombre_completo: "Test User",
    correo: "testuser@example.com",
    usuario: "testuser",
    contrasena: "test1234"
  };

  let loggedUser = null; // Para guardar datos del login

  it("POST /register -> debería registrar un usuario nuevo", async () => {
    const res = await request(server)
      .post("/register")
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/usuario creado/i);
  });

  it("POST /register -> no debe registrar usuario duplicado", async () => {
    const res = await request(server)
      .post("/register")
      .send(testUser);
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/existe/i);
  });

  it("POST /login -> debe hacer login con datos correctos", async () => {
    const res = await request(server)
      .post("/login")
      .send({ correo: testUser.correo, contrasena: testUser.contrasena });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.correo).toBe(testUser.correo);
    loggedUser = res.body.user;
  });

  it("POST /login -> no debe hacer login con contraseña incorrecta", async () => {
    const res = await request(server)
      .post("/login")
      .send({ correo: testUser.correo, contrasena: "wrongpass" });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/search?user=usuario -> debe obtener imágenes de un usuario", async () => {
    if (!loggedUser) return; // solo si hubo login
    const res = await request(server)
      .get(`/api/search?user=${testUser.usuario}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
