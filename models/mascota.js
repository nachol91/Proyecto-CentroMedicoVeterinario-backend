const {Schema, model} = require("mongoose");

const MascotaSchema = Schema({
    nombre: {type: String, required:[true, "el nombre es obligatorio"]}, 
    especie: {type: String, enum:["CANINO", "FELINO", "OTRO"], required:[true, "la especie del animal es obligatoria"]}, 
    raza: {type: String, default: "mestizo"},
    edad: {type: Number, required:[true, "la edad es obligatoria"]},
    sexo: {type: String, enum: ["MACHO", "HEMBRA"], required:[true, "el sexo es obligatorio"]},
    peso: {type: Number, required:[true, "el peso es obligatorio"]},
    img: {type: String},
    estado: {type: Boolean, default: true},
    medicoQueCrea: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    dueno: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    historiaClinica: {type: String, default: ""},
    fechaRegistro: {type: Date, default: Date.now}

});

module.exports = model("Mascota", MascotaSchema);