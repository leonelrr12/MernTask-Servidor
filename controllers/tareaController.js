const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

// Crear una nueva Tarea
exports.crearTarea = async (req, res) => {

    // Verificar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // Extraer proyecto y comprobar si existe
    const {proyecto} = req.body;

    try {
        // Verificar si proyecto existe
        const verProyecto = await Proyecto.findById(proyecto);
        if(!verProyecto){
            return res.status(404).json({msj: 'Proyecto no existe!'});
        }

        // Verificar que el proyecto actual pertenece al usuario autenticado
        if(verProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msj: 'No autorizado.'});
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send({msj: 'Hubo un error"'});
    }
};

// Obtener Tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    try {

        // Extraer proyecto y comprobar si existe
        //const {proyecto} = req.body;
        // Asi se extrae cuando viene como parametro
        const { proyecto } = req.params;
   
        // Verificar si proyecto existe
        const verProyecto = await Proyecto.findById(proyecto);
        if(!verProyecto){
            return res.status(404).json({msj: 'Proyecto no existe!'});
        }

        // Verificar que el proyecto actual pertenece al usuario autenticado
        if(verProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msj: 'No autorizado.'});
        }  
        
        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un eror!');
    }
};

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {

    try {
        // Extraer proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msj: 'Tarea no existe!'});
        }

        // Verificar si proyecto existe
        if(proyecto){
            const existeProyecto = await Proyecto.findById(proyecto);
            if(!existeProyecto){
                return res.status(404).json({msj: 'Proyecto no existe!'});
            }
            // Verificar que el proyecto actual pertenece al usuario autenticado
            if(existeProyecto.creador.toString() !== req.usuario.id) {
                return res.status(401).json({msj: 'No autorizado.'});
            }
        }

        // Crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        nuevaTarea.proyecto = proyecto;

        // Actualizar Tarea
        tarea = await Tarea.findOneAndUpdate(
            {_id: req.params.id}, 
            nuevaTarea, 
            {new: true}
        );

        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un eror!');
    }
 
};


exports.eliminarTarea = async (req, res) => {

    try {

        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msj: 'Tarea no existe!'});
        }

        // Eliminar el Tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msj: 'Tarea eliminada.'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un eror!');
    }
};
