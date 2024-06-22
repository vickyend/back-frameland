const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Buscar usuario por nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Comparando contraseñas:', isMatch); // Agregar log aquí para verificar si la comparación es correcta
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }


    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Devolver el token como respuesta
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};



const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};



const deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status (500).json({ message: 'Error al eliminar usuario', error });
  }
};

module.exports = { register, login, getUser, getAllUsers, deleteUser };
