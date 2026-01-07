const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '15122003',
  database: 'carrito_compras',
  port: 5432
});

// Endpoint: obtener productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: agregar producto
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  try {
    await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES ($1, $2, $3, $4)',
      [nombre, descripcion, precio, imagen]
    );
    res.json({ mensaje: 'Producto agregado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servidor
app.listen(3001, () => {
  console.log('Productos-service corriendo en puerto 3001');
});
