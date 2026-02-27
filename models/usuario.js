const {Schema, model} = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {type: String, required:[true, "el nombre es obligariorio"]},
    apellido: {type: String, required:[true, "el apellido es obligatorio"]},
    correo: {type: String, required:[true, "el correo es obligatorio"], unique: true},
    telefono: {type: Number, required:[true, "el telefono es obligario"]},
    password: {type: String, required:[true, "el password es obligatorio"]},
    rol: {type: String, required:[true, "el rol es obligatorio"]},
    img: {type: String},
    fechaRegistro: {type: Date, default: Date.now},
    estado: {type: Boolean, default: true}
});

module.exports = model("Usuario", UsuarioSchema);