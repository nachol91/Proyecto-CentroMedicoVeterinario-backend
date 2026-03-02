const { Schema, model } = require('mongoose');

const RolSchema = Schema({
    nivel: { type:String, required:[true, 'El rol es obligatorio'], unique: true},
    estado: {type: Boolean, default: true}
});

module.exports = model('Rol',RolSchema);