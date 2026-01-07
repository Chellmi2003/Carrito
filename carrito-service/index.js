const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión PostgreSQL
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '15122003',
  database: 'carrito_compras',
  port: 5432
});

// Ver carrito
app.get('/api/carrito', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT carrito.id, productos.nombre, productos.precio, carrito.cantidad
      FROM carrito
      JOIN productos ON carrito.producto_id = productos.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar al carrito
app.post('/api/carrito', async (req, res) => {
  const { producto_id, cantidad } = req.body;

  try {
    await pool.query(
      'INSERT INTO carrito (producto_id, cantidad) VALUES ($1, $2)',
      [producto_id, cantidad]
    );
    res.json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad
app.put('/api/carrito/:id', async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    await pool.query(
      'UPDATE carrito SET cantidad = $1 WHERE id = $2',
      [cantidad, id]
    );
    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Eliminar producto del carrito
app.delete('/api/carrito/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM carrito WHERE id = $1', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servidor
app.listen(3002, () => {
  console.log('Carrito-service corriendo en puerto 3002');
});
