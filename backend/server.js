require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas (usa tu cadena de conexión del .env)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Modelo de Usuario
const User = mongoose.model('User', {
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'driver'], default: 'client' }
});

// Ruta de registro
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role = 'client' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'El usuario ya está registrado.' });
    }

    // Encriptar contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: '¡Registro exitoso!' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Ruta de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Validar contraseña
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar token JWT (válido por 1 hora)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'clave_secreta_para_desarrollo',
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Inicio de sesión exitoso.',
      token,
      role: user.role 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Ruta protegida de ejemplo (solo para usuarios autenticados)
app.get('/api/dashboard', authenticate, (req, res) => {
  res.json({ message: `Bienvenido ${req.user.role}` });
});

// Middleware de autenticación
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_para_desarrollo');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});