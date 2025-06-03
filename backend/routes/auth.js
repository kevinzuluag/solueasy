const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, password],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Este correo ya está registrado.' });
      }
      res.json({ message: 'Usuario registrado correctamente' });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error del servidor' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      res.json({ message: 'Login exitoso', user: row });
    }
  );
});

module.exports = router;
