// server.js
require("dotenv").config();
const http       = require("http");
const fs         = require("fs");
const path       = require("path");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const mysql      = require("mysql2/promise");
const bcrypt     = require("bcrypt");
const { URL }    = require("url");

// —–– Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// —–– Pool MySQL
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASS,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
});

// —–– Mime types para servir estáticos
const mime = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  // Log de cada petición para depuración
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const urlObj   = new URL(req.url, `http://${req.headers.host}`);
  let   pathname = urlObj.pathname;

  // ─── 1) Sirve archivos estáticos de /public ────────────────────────────────
  if (req.method === "GET" && !pathname.startsWith("/api/")) {
    if (pathname === "/") pathname = "/index.html";
    const fp = path.join(__dirname, "public", pathname);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      const ext  = path.extname(fp);
      const type = mime[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      return fs.createReadStream(fp).pipe(res);
    }
  }

  // ─── 2) Registro: POST /register ──────────────────────────────────────────
  if (req.method === "POST" && pathname === "/register") {
    let body = "";
    req.on("data", chunk => body += chunk);
    return req.on("end", async () => {
      try {
        const { nombre_completo, correo, usuario, contrasena } = JSON.parse(body);
        if (!nombre_completo || !correo || !usuario || !contrasena) {
          res.writeHead(400, {"Content-Type":"application/json"});
          return res.end(JSON.stringify({ success:false, message:"Faltan datos" }));
        }
        const hash = await bcrypt.hash(contrasena, 10);
        await pool.query(
          `INSERT INTO usuarios (nombre_completo, correo, usuario, contrasena)
           VALUES (?, ?, ?, ?)`,
          [nombre_completo, correo, usuario, hash]
        );
        res.writeHead(201, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({ success:true, message:"Usuario creado" }));
      } catch (err) {
        console.error("Error /register:", err);
        const msg = err.code === "ER_DUP_ENTRY" ? "Correo o usuario ya existe" : "Error interno";
        res.writeHead(500, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({ success:false, message: msg }));
      }
    });
  }

  // ─── 3) Login: POST /login ─────────────────────────────────────────────────
  if (req.method === "POST" && pathname === "/login") {
    let body = "";
    req.on("data", chunk => body += chunk);
    return req.on("end", async () => {
      try {
        const { correo, contrasena } = JSON.parse(body);
        const [rows] = await pool.query(
          `SELECT id, correo, contrasena, nombre_completo, usuario FROM usuarios WHERE correo = ?`,
          [correo]
        );
        if (!rows.length) {
          res.writeHead(401, {"Content-Type":"application/json"});
          return res.end(JSON.stringify({ success:false, message:"Correo no registrado" }));
        }
        const user = rows[0];
        const ok   = await bcrypt.compare(contrasena, user.contrasena);
        if (!ok) {
          res.writeHead(401, {"Content-Type":"application/json"});
          return res.end(JSON.stringify({ success:false, message:"Contraseña incorrecta" }));
        }
        res.writeHead(200, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({
          success: true,
          message: "Ingreso correcto",
          user:    { 
            id: user.id, 
            correo: user.correo, 
            nombre_completo: user.nombre_completo, 
            usuario: user.usuario 
          }
        }));
      } catch (err) {
        console.error("Error /login:", err);
        res.writeHead(500, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({ success:false, message:"Error servidor" }));
      }
    });
  }


  // 4) Subida de imagen: POST /upload?user_id=…
if (req.method === "POST" && pathname === "/upload") {
    console.log("→ Handler /upload invocado");
    const uid = urlObj.searchParams.get("user_id");
    if (!uid) {
      res.writeHead(400, { "Content-Type":"application/json" });
      return res.end(JSON.stringify({ error:"Falta user_id en la query" }));
    }
  
const form = new formidable.IncomingForm({ 
    multiples: false,
    maxFileSize: 10 * 1024 * 1024
    });   
     return form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parseando formulario:", err);
        res.writeHead(500, { "Content-Type":"application/json" });
        return res.end(JSON.stringify({ error:"No se pudo procesar formulario" }));
      }
  
      let file = files.image;
      if (Array.isArray(file)) file = file[0];
      const fp = file?.filepath || file?.path;
      if (!fp) {
        res.writeHead(400, { "Content-Type":"application/json" });
        return res.end(JSON.stringify({ error:"No se encontró archivo" }));
      }
  
      try {
        // 1) Subida a Cloudinary
        const result = await cloudinary.uploader.upload(fp);
        const imageUrl = result.secure_url;
  
        // 2) Elige un valor válido para tu ENUM
        //    Aquí un ejemplo dinámico por ancho, pero puedes poner 'card_small' fijo
        const width = result.width || 0;
        let sizeEnum;
        if (width < 500) sizeEnum = 'card_small';
        else if (width < 1000) sizeEnum = 'card_medium';
        else sizeEnum = 'card_large';
  
        // 3) Guarda en MySQL usando ese string
        await pool.query(
          `INSERT INTO imagenes (user_id, url, size, uploaded_at)
           VALUES (?, ?, ?, NOW())`,
          [uid, imageUrl, sizeEnum]
        );
  
        // 4) Responde al cliente
        res.writeHead(200, { "Content-Type":"application/json" });
        return res.end(JSON.stringify({ url:imageUrl }));
      } catch (uploadErr) {
        console.error("Error durante upload:", uploadErr);
        res.writeHead(500, { "Content-Type":"application/json" });
        return res.end(JSON.stringify({ error:uploadErr.message }));
      }
    });
  }
  

  // ─── 5) Eliminar imagen: DELETE /api/images/:id ──────────────────────────────
  if (req.method === "DELETE" && pathname.includes("/api/images/")) {
    console.log('\n=== SOLICITUD DELETE RECIBIDA ===');
    console.log('URL completa:', req.url);
    console.log('Pathname:', pathname);
    
    try {
      // Extraer el ID de la imagen de la URL
      const imageId = pathname.split('/').pop();
      const userId = urlObj.searchParams.get("user_id");
      
      console.log('Datos extraídos:', { imageId, userId });
      
      if (!userId) {
        console.log('Error: Usuario no autenticado');
        res.writeHead(401, {"Content-Type": "application/json"});
        return res.end(JSON.stringify({success: false, message: "Usuario no autenticado"}));
      }
      
      // Verificar que la imagen pertenece al usuario
      const [check] = await pool.query(
        "SELECT id FROM imagenes WHERE id = ? AND user_id = ?",
        [imageId, userId]
      );
      
      if (check.length === 0) {
        res.writeHead(404, {"Content-Type": "application/json"});
        return res.end(JSON.stringify({success: false, message: "Imagen no encontrada o no tienes permisos"}));
      }
      
      // Eliminar la imagen de la base de datos
      await pool.query("DELETE FROM imagenes WHERE id = ?", [imageId]);
      
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify({success: true, message: "Imagen eliminada correctamente"}));
      
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      res.writeHead(500, {"Content-Type": "application/json"});
      res.end(JSON.stringify({success: false, message: "Error al eliminar la imagen"}));
    }
    return;
  }

  // ─── 6) Obtener galería: GET /api/images?user_id=… ──────────────────────────
  console.log('\n=== MANEJANDO RUTA ===');
  console.log('Método:', req.method);
  console.log('Pathname:', pathname);
  console.log('URL completa:', req.url);
  
  if (req.method === "GET" && pathname === "/api/images") {
    try {
      const uid    = urlObj.searchParams.get("user_id");
      let   sql    = "SELECT * FROM imagenes";
      const params = [];
      if (uid) {
        sql += " WHERE user_id = ?";
        params.push(uid);
      }
      const [imgs] = await pool.query(sql, params);
      res.writeHead(200, {"Content-Type":"application/json"});
      return res.end(JSON.stringify(imgs));
    } catch (err) {
      console.error("Error /api/images:", err);
      res.writeHead(500, {"Content-Type":"application/json"});
      return res.end(JSON.stringify({ error:"Error servidor" }));
    }
  }

    // ----- 6) Obtener imagenes por nombre de usuario: GET /api/search?user=…
  if (req.method === "GET" && pathname === "/api/search") {
    try {
      const user = urlObj.searchParams.get("user");
      if (!user) {
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({ error:"Falta parámetro user" }));
      }
      const [rows] = await pool.query(
        `SELECT i.* FROM imagenes i
         JOIN usuarios u ON i.user_id = u.id
         WHERE u.usuario = ?`,
        [user]
      );
      res.writeHead(200, {"Content-Type":"application/json"});
      return res.end(JSON.stringify(rows));
    } catch (err) {
      console.error("Error /api/search:", err);
      res.writeHead(500, {"Content-Type":"application/json"});
      return res.end(JSON.stringify({ error:"Error servidor" }));
    }
  }

  // --- 7) objetener imagenes por fecha: GET /api/images?date=…
  if (req.method === "GET" && pathname === "/api/images/date") {
    try {
      const date = urlObj.searchParams.get("date");
      if (!date) {
        res.writeHead(400, {"Content-Type":"application/json"});
        return res.end(JSON.stringify({ error:"Falta parámetro date" }));
      }
      const [rows] = await pool.query(
        `SELECT * FROM imagenes WHERE DATE(uploaded_at) = ?`,
        [date]
      );
      res.writeHead(200, {"Content-Type":"application/json"});
      return res.end(JSON.stringify(rows));
    } catch (err) {
      console.error("Error /api/images/date:", err);
      res.writeHead(500, {"Content-Type":"application/json"});
      return res.end(JSON.stringify({ error:"Error servidor" }));
    }
  }


  // ─── 7) Cualquier otra ruta → 404 ────────────────────────────────────────────
  res.writeHead(404, {"Content-Type":"application/json"});
  res.end(JSON.stringify({ 
    error: "Ruta no encontrada",
    method: req.method,
    url: req.url,
    pathname: pathname
  }));
});



module.exports = server;
