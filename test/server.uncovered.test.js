const request = require('supertest');
const server = require('../server');

describe('Pruebas para aumentar cobertura y cubrir líneas no cubiertas', () => {

  // POST /register sin datos
  it('POST /register sin datos debe devolver 400', async () => {
    const res = await request(server).post('/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // POST /register con datos inválidos o incompletos (puedes probar varias combinaciones)
  it('POST /register con datos incompletos debe devolver 400', async () => {
    const res = await request(server).post('/register').send({ correo: 'email@domain.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // POST /login con correo inexistente
  it('POST /login con correo inexistente devuelve 401', async () => {
    const res = await request(server).post('/login').send({ correo: 'noexiste@example.com', contrasena: '1234' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // POST /login con contraseña incorrecta
  it('POST /login con contraseña incorrecta devuelve 401', async () => {
    // Asume que testuser@example.com sí existe
    const res = await request(server).post('/login').send({ correo: 'testuser@example.com', contrasena: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // GET ruta no existente → 404
  it('GET /ruta/no/existe debe devolver 404', async () => {
    const res = await request(server).get('/ruta/no/existe');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/ruta no encontrada/i);
  });

  // POST /upload sin user_id
  it('POST /upload sin user_id debe devolver 400', async () => {
    const res = await request(server).post('/upload');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/falta user_id/i);
  });

  // DELETE imagen sin user_id
  it('DELETE /api/images/1 sin user_id devuelve 401', async () => {
    const res = await request(server).delete('/api/images/1');
    expect(res.statusCode).toBe(401);
  });

  // DELETE imagen inexistente
  it('DELETE /api/images/99999 con user_id retorna 404', async () => {
    const res = await request(server).delete('/api/images/99999?user_id=1');
    expect(res.statusCode).toBe(404);
  });

  // GET /api/images sin user_id (debe devolver todas las imágenes)
  it('GET /api/images sin user_id devuelve todas las imágenes', async () => {
    const res = await request(server).get('/api/images');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET /api/images con user_id
  it('GET /api/images con user_id devuelve imágenes solo de ese usuario', async () => {
    const res = await request(server).get('/api/images?user_id=1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET /api/images/date sin parámetro date
  it('GET /api/images/date sin parámetro date devuelve 400', async () => {
    const res = await request(server).get('/api/images/date');
    expect(res.statusCode).toBe(400);
  });

  // GET /api/images/date con fecha válida
  it('GET /api/images/date con fecha válida devuelve array', async () => {
    const res = await request(server).get('/api/images/date?date=2025-06-01');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(() => {
    server.close();
  });

});
