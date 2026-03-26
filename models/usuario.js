const {Schema, model} = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {type: String, required:[true, "el nombre es obligariorio"]},
    apellido: {type: String, required:[true, "el apellido es obligatorio"]},
    correo: {type: String, required:[true, "el correo es obligatorio"], unique: true},
    telefono: {type: String, required:[true, "el telefono es obligario"]},
    password: {type: String, required:[true, "el password es obligatorio"]},
    nivel: {type: String, required:[true, "el rol es obligatorio"]},
    mascotas: {type: Array},
    img: {type: String},
    fechaRegistro: {type: Date, default: Date.now},
    estado: {type: Boolean, default: true}
});

module.exports = model("Usuario", UsuarioSchema);