const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://scarecroft-indonesia.vercel.app',
    'https://scarecroft-backend.vercel.app/',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Access denied by CORS ScareCorft Indonesia'));
        }
    }
}));

app.use(express.json());
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.get('/api', (req, res) => {
    res.send('Scarecroft RESTful API is running successfully');
});

app.post('/api/messages', async (req, res) => {
    const { name, email, whatsapp, message } = req.body;

    const { data, error } = await supabase
        .from('messages')
        .insert([{ name, email, whatsapp, message }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ success: true, message: 'Pesan berhasil dikirim', data });
});

app.post('/api/portfolio', async (req, res) => {
    const { name, description, image_url, project_url, status } = req.body;

    const { data, error } = await supabase
        .from('portfolio')
        .insert([{ name, description, image_url, project_url, status }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ success: true, message: 'Project added successfully', data });
});
module.exports = app;