// test/user.test.js
const request = require("supertest");
const server = require("../server"); // tu server.js

describe("User endpoints", () => {
  // Usuario dinámico para pruebas, con un timestamp para evitar duplicados
  const timestamp = Date.now();
  const testUser = {
    nombre_completo: "Test User",
    correo: `testuser${timestamp}@example.com`,
    usuario: `testuser${timestamp}`,
    contrasena: "test1234"
  };

  let loggedUser = null; // Para guardar datos del login

  beforeAll(async () => {
    // Intentar registrar usuario para las pruebas
    const res = await request(server)
      .post("/register")
      .send(testUser);

    // Si ya existe, hacer login para obtener id
    if (res.statusCode === 201) {
      // Usuario creado con éxito
      const loginRes = await request(server)
        .post("/login")
        .send({ correo: testUser.correo, contrasena: testUser.contrasena });
      loggedUser = loginRes.body.user;
    } else if (res.statusCode === 409) {
      // Usuario ya existe, hacer login igual
      const loginRes = await request(server)
        .post("/login")
        .send({ correo: testUser.correo, contrasena: testUser.contrasena });
      loggedUser = loginRes.body.user;
    } else {
      throw new Error(`Error preparando usuario para pruebas: ${res.statusCode}`);
    }
  });

  it("POST /register -> no debe registrar usuario duplicado con mismo correo/usuario", async () => {
    const res = await request(server)
      .post("/register")
      .send(testUser);
    expect(res.statusCode).toBe(409);
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
  // Cerrar servidor para evitar procesos colgados
  afterAll(() => {
    server.close();
  });
});

