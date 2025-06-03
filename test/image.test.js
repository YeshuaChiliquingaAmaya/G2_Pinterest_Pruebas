// test/image.test.js
const request = require('supertest');
const path = require('path');
const server = require('../server');

describe('Image endpoints', () => {
  // Para pruebas necesitaremos user_id (deberías tener uno en tu DB, o usar el del login)
  // Aquí asumimos un usuario test con id 1 (puedes cambiarlo)
  const userId = 17;
  let uploadedImageId = null;

  it('POST /upload?user_id=… -> debería subir imagen', async () => {
    const res = await request(server)
      .post(`/upload?user_id=${userId}`)
<<<<<<< HEAD
      .attach("image", path.resolve(__dirname, "../public/images/Pinterest_icon.png"));
=======
      .attach('image', path.resolve(__dirname, '../public/images/pinteres.icon'));
>>>>>>> 76e5affcc5308d77a8ab47ccfb837f2411b3a365
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
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
    afterAll(() => {
    server.close();
    });
});


