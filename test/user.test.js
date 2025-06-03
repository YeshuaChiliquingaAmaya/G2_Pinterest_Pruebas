const request = require('supertest');
const server = require('../server');

describe('Errores y casos negativos en API', () => {

  it('POST /register sin campos debe retornar 400', async () => {
    const res = await request(server)
      .post('/register')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/faltan datos/i);
  });

  it('POST /register con usuario duplicado debe retornar 409', async () => {
    // Intenta registrar el usuario testuser dos veces para forzar duplicado
    const user = {
      nombre_completo: 'Test User',
      correo: 'testuser@example.com',
      usuario: 'testuser',
      contrasena: 'test1234'
    };

    // Primera inserción (puede ser omitida si ya existe)
    await request(server).post('/register').send(user);

    // Segunda inserción
    const res = await request(server)
      .post('/register')
      .send(user);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/existe/i);
  });

  it('POST /login con correo no registrado debe retornar 401', async () => {
    const res = await request(server)
      .post('/login')
      .send({ correo: 'noexiste@example.com', contrasena: '123456' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/no registrado/i);
  });

  it('POST /login con contraseña incorrecta debe retornar 401', async () => {
    const res = await request(server)
      .post('/login')
      .send({ correo: 'testuser@example.com', contrasena: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/contraseña incorrecta/i);
  });

  it('POST /upload sin user_id debe retornar 400', async () => {
    const res = await request(server)
      .post('/upload');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/falta user_id/i);
  });

  it('DELETE /api/images/:id sin user_id debe retornar 401', async () => {
    const res = await request(server)
      .delete('/api/images/1');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /api/images/:id con imagen no existente debe retornar 404', async () => {
    const res = await request(server)
      .delete('/api/images/99999?user_id=1'); // asumiendo id 99999 no existe
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/search sin parámetro user debe retornar 400', async () => {
    const res = await request(server)
      .get('/api/search');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/falta parámetro user/i);
  });

  it('Ruta no existente debe retornar 404', async () => {
    const res = await request(server)
      .get('/ruta/inexistente');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/ruta no encontrada/i);
  });

  // Cerrar servidor para evitar procesos colgados
  afterAll(() => {
    server.close();
  });
});
