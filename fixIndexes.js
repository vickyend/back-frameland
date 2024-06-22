const mongoose = require('mongoose');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno
const User = require('./models/User'); // Asegúrate de que la ruta es correcta

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Conectado a MongoDB Atlas');

  // Lista todos los índices para verificar cuál eliminar
  const indexes = await User.collection.indexes();
  console.log('Índices antes de la eliminación:', indexes);

  // Eliminar todos los índices que no sean el índice predeterminado (_id)
  await User.collection.dropIndexes();
  console.log('Todos los índices eliminados');

  // Crear los índices necesarios de nuevo
  await User.collection.createIndex({ username: 1 }, { unique: true });
  await User.collection.createIndex({ email: 1 }, { unique: true });
  console.log('Índices recreados');

  // Lista los índices nuevamente para confirmar
  const updatedIndexes = await User.collection.indexes();
  console.log('Índices después de la recreación:', updatedIndexes);

  // Cierra la conexión
  mongoose.connection.close();
})
.catch((error) => {
  console.error('Error de conexión:', error);
  mongoose.connection.close();
});
