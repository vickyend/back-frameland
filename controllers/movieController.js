const Movie = require('../models/Movie');
const User = require('../models/User');

const addMovie = async (req, res) => {
  const { title, description, releaseDate } = req.body;
  const userId = req.user.id;

  try {
    const movie = new Movie({ title, description, releaseDate, user: userId });
    await movie.save();

    const user = await User.findById(userId);
    user.movies.push(movie._id);
    await user.save();

    res.status(201).json({ message: 'Película añadida exitosamente', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir película', error });
  }
};

const getMovies = async (req, res) => {
  const userId = req.user.id;

  try {
    const movies = await Movie.find({ user: userId });
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas', error });
  }
};

const updateMovie = async (req, res) => {
  const { title, description, releaseDate } = req.body;
  const movieId = req.params.id;

  try {
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { title, description, releaseDate },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    res.status(200).json({ message: 'Película actualizada exitosamente', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar película', error });
  }
};

const deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findByIdAndDelete(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    await User.updateOne(
      { _id: movie.user },
      { $pull: { movies: movie._id } }
    );

    res.status(200).json({ message: 'Película eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar película', error });
  }
};

module.exports = { addMovie, getMovies, updateMovie, deleteMovie };
