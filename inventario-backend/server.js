require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(bodyParser.json());

// Ruta de prueba
app.get('/ping', (req, res) => res.send('pong'));

// GET productos
app.get('/productos', async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// POST productos
app.post('/productos', async (req, res) => {
  const { data, error } = await supabase.from('productos').insert([req.body]).single();
  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

// PUT producto
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('productos').update(req.body).eq('id', id).single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// DELETE producto
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('productos').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  res.json({ mensaje: 'Producto eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
