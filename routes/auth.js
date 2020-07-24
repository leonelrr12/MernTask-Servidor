// Rutas para autenticar
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar Sesion
// api/auth
router.post('/', 
    authController.autenticarUsuario
);
// [
//     check('email', 'Agrega un email válido').isEmail(),
//     check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
// ],

// Obtienen usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);



module.exports = router;