 const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulación de una base de datos en memoria
const users = [];

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor backend funcionando 🚀');
});

// Ruta de registro
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'El usuario ya está registrado.' });
    }

    users.push({ email, password }); // Aquí deberías encripar la contraseña en producción
    res.status(201).json({ message: '¡Registro exitoso!' });
});

// Ruta de login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    res.json({ message: 'Inicio de sesión exitoso.' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});