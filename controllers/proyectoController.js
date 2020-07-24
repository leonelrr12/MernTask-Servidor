const Proyecto = require('../models/Proyecto');
const {check} = require('express-validator');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // Verificar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // Guardar el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send({ msj: 'Hubo un error!'});
    }    
};

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json({proyectos});
    } catch {
        console.log(error);
        res.status(500).send({ msj: 'Hubo un error!'});
    }
}; 

// Actualizar nombre del proyecto
exports.actualizarProyecto = async (req, res) => {

    // Verificar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // Extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Validar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si existe el proyecto
        if(!proyecto) {
            return res.status(404).json({msj: ''});
        }

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msj: 'No autorizado.'});
        }

        // Actualizar nombre del Proyecto
        proyecto = await Proyecto.findByIdAndUpdate(
            {_id: req.params.id}, 
            {$set : nuevoProyecto}, 
            {new: true}
        );

        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send({ msj: 'Error en el servidor, Actualizar nombre de Proyecto.'});
    }
};

// Elimnar un proyecto or su ID
exports.eliminarProyecto = async (req, res) => {

    try {
        // Validar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si existe el proyecto
        if(!proyecto) {
            return res.status(404).json({msj: ''});
        }

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msj: 'No autorizado.'});
        }

        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});
        res.json({msj: 'Proyecto eliminado.'});

    } catch (error) {
        console.log(error);
        res.status(500).send({ msj: 'Error en el servidor, Eliminando un Proyecto.'});
    }
}