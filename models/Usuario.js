const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true  // Validar llave unica para el email
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()
    },

});

module.exports = mongoose.model('Usuario', UsuarioSchema);