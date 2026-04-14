const {Schema, model} = require ("mongoose");

const TurnoSchema = Schema({
    fecha: { type: Date, require: [true, "La fecha es obligatoria" ]},
    tipoDeEstudio: { type: String, require: true, enum: ['CONSULTA GENERAL', 'PRE-QUIRURGICO', 'ECOGRAFIA', 'RADIOGRAFIA', 'ELECTROCARDIOGRAMA'], default: "CONSULTA GENERAL"},
    descripcion: { type: String, require: [true, "La descripcion es obligatoria"]},
    dueno: { type: Schema.Types.ObjectId, ref: "Usuario", require: true},
    mascota: { type: Schema.Types.ObjectId, ref: "Mascota", require: true},
    medico: { type: Schema.Types.ObjectId, ref: "Usuario", require: true},
    estado: { type: String, enum: ["PENDIENTE", "REALIZADO", "CANCELADO"], default: "PENDIENTE"}, 
},
{timestamps: true});

module.exports = model("Turno", TurnoSchema);
