// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

// Crea una tarea
// api/tarea
router.post('/', 
    auth,
    [
        check('nombre', 'Nombre de la Trea es obligatorio.').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener las tareas por proyecto
router.get('/:proyecto',
    auth,
    tareaController.obtenerTareas
);

// Actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Actualizar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;
