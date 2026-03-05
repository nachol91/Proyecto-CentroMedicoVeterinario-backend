const {Schema, model} = require("mongoose");

const MascotaSchema = Schema({
    nombre: {type: String, required:[true, "el nombre es obligatorio"]}, 
    especie: {type: String, required:[true, "la especie del animal es obligatoria"]}, 
    raza: {type: String, required:[true, "la raza es obligatoria"]}, 
    peso: {type: String, required:[true, "el peso es obligatorio"]},
    historiaClinica: {type: String, required:[true, "la historia clinica es obligatoria"]},
    img: {type: String},
    fechaRegistro: {type: Date, default: Date.now},
    usuario: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    estado: {type: Boolean, default: true}

});

module.exports = model("Mascota", MascotaSchema);