const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { expressjwt: jwt } = require('express-jwt'); // Nota el cambio aquí

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/api/auth/register',
  '/api/auth/login'
];

// Middleware de JWT para proteger las rutas
app.use(
  jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({ path: publicRoutes })
);

// Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((error) => console.error('Error de conexión:', error));

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
