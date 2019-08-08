const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario para crear un registro de usuario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario para crear un registro de usuario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    }, /// no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE'
    }, //default: 'USER_ROLE
    state: {
        type: Boolean,
        default: true
    }, //Boolean
    google: {
        type: Boolean,
        default: false
    } //Boolean

});

module.exports = mongoose.model('Usuario', usuarioSchema);