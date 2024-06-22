const express = require('express');
const { register, login, getUser, getAllUsers, deleteUser } = require('../controllers/authController');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', getUser);
router.get('/users',  getAllUsers);
router.delete('/user', deleteUser);

module.exports = router;
