const request = require('supertest');
const path = require('path');
const server = require('../server');

describe('Image endpoints', () => {
  const userId = 17;
  let uploadedImageId = null;

  it('POST /upload?user_id=… -> debería subir imagen', async () => {
    const res = await request(server)
      .post(`/upload?user_id=${userId}`)
      .attach('image', path.resolve(__dirname, '../public/images/Pinterest_icon.png'));
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
  });

  it('POST /upload sin user_id debe retornar 400', async () => {
    const res = await request(server)
      .post('/upload')
      .field('dummy', 'test');  // IMPORTANTE: envía un campo para que formidable no falle
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/falta user_id/i);
  });

  it('GET /api/images?user_id=… -> debería obtener galería de imágenes del usuario', async () => {
    const res = await request(server)
      .get(`/api/images?user_id=${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      uploadedImageId = res.body[0].id;
    }
  });

  it('DELETE /api/images/:id?user_id=… -> debería eliminar la imagen', async () => {
    if (!uploadedImageId) {
      return console.warn('No hay imagen para eliminar');
    }
    const res = await request(server)
      .delete(`/api/images/${uploadedImageId}?user_id=${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/images/:id sin user_id debe retornar 401', async () => {
    const res = await request(server)
      .delete('/api/images/1');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /api/images/:id con imagen inexistente debe retornar 404', async () => {
    const res = await request(server)
      .delete(`/api/images/99999?user_id=${userId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/images sin user_id retorna todas las imágenes', async () => {
    const res = await request(server)
      .get('/api/images');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/images/date sin parámetro date debe retornar 400', async () => {
    const res = await request(server)
      .get('/api/images/date');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/falta parámetro date/i);
  });

  it('GET /api/images/date con fecha válida retorna array', async () => {
    const fecha = '2025-06-01'; // Ajusta si necesitas
    const res = await request(server)
      .get(`/api/images/date?date=${fecha}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  afterAll(() => {
    server.close();
  });
});
