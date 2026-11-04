const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Konfigurasi CORS agar bisa ditembak oleh Landing Page & Dashboard Admin Anda
const allowedOrigins = [
    'https://scarecroft-indonesia.vercel.app',
    'https://scarecroft-backend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Akses diblokir oleh kebijakan CORS ScareCroft!'));
    }
  }
}));

app.use(express.json());

// Inisialisasi Supabase menggunakan Service Role Key agar bisa bypass RLS Dashboard Admin
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 1. Endpoint Uji Coba API
app.get('/', (req, res) => {
  res.send('ScareCroft RESTful API is running successfully!');
});

// 2. Endpoint Menerima Pesan dari Landing Page (POST)
app.post('/api/messages', async (req, res) => {
  const { name, email, whatsapp, message } = req.body;
  
  const { data, error } = await supabase
    .from('messages')
    .insert([{ name, email, whatsapp, message }]);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ success: true, message: 'Pesan berhasil dikirim!' });
});

// 3. Endpoint Mengambil Portofolio untuk Landing Page (GET)
app.get('/api/portfolios', async (req, res) => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});

// 4. Endpoint Menambah Portofolio dari Dashboard Admin (POST)
app.post('/api/portfolios', async (req, res) => {
  const { title, description, tag, image_url, project_url, status } = req.body;

  const { data, error } = await supabase
    .from('portfolios')
    .insert([{ title, description, tag, image_url, project_url, status }]);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ success: true, message: 'Portofolio berhasil ditambahkan!' });
});

// Endpoint Mengambil Semua Pesan Masuk untuk Dashboard Admin (GET)
app.get('/api/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
});


module.exports = app;
