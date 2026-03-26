const { request, response } = require("express");
const Turno = require("../models/turno");


const turnosGet = async (req =  request, res = response) =>{
    const { desde = 0, limite = 100} = req.query;
    let query = {};    

    try {
        const [total, turnos] = await Promise.all([
            Turno.countDocuments(query),
            Turno.find(query)
            .populate('dueno', 'nombre apellido telefono')
            .populate('medico', 'nombre apellido')
            .populate('mascota', 'nombre especie raza peso')
            .skip(desde).limit(limite).sort({fecha:1})
        ]);

        res.json({total, turnos});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "error al obtener los turnos"});        
    }
};

const turnoPost = async (req = request, res = response) =>{
    const { fecha, tipoDeEstudio, descripcion, dueno, mascota, medico } = req.body;

    const fechaTurno = new Date(fecha);
    const ahora = new Date();

    if (fechaTurno < ahora) {
        return res.status(400).json({
            msg: "No es posible crear un turno en una fecha/hora pasada"
        });
    }

    try {
        
        const existeTurnoMascota = await Turno.findOne({ fecha, mascota, estado: "PENDIENTE" });
        
        if (existeTurnoMascota) {
            return res.status(400).json({msg: "Esta mascota ya tiene un turno asignado para ese horario"});
        }        
        
        const existeTurnoMedico = await Turno.findOne({medico, fecha, estado: "PENDIENTE"});

        if(existeTurnoMedico){
            return res.status(400).json({msg:"El medico ya tiene un turno asignado en esa fecha y hora"});
        }

        const data = { fecha, tipoDeEstudio, descripcion, dueno, mascota, medico };

        const turno = new Turno(data);
        await turno.save();

        res.json({
            msg:"turno creado con exito",
            turno
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"error al crear el turno, hable con el ADMIN"})        
    }
};

const turnoPut = async (req = request, res = response) => {
    const { id } = req.params;

    const { fecha, descripcion, tipoDeEstudio, medico } = req.body;

    try {
        const cambios = {};
        if (fecha) cambios.fecha = fecha;
        if (descripcion) cambios.descripcion = descripcion;
        if (tipoDeEstudio) cambios.tipoDeEstudio = tipoDeEstudio;
        if (medico) cambios.medico = medico;

        const turnoActualizado = await Turno.findByIdAndUpdate(id, cambios, { new: true })
            .populate('dueno', 'nombre apellido')
            .populate('mascota', 'nombre')
            .populate('medico', 'nombre apellido');

        res.json({
            msg: "Turno reprogramado/editado con éxito",
            turnoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al editar el turno" });
    }
};

const turnoPatch = async (req = request, res = response) =>{

    const { id } = req.params;
    const { estado } = req.body; 

    try {
        
        const turnoActualizado = await Turno.findByIdAndUpdate(id, { estado }, { new: true })
        .populate('medico', 'nombre apellido')
        .populate('mascota', 'nombre');

        res.json({
            msg: "Atención finalizada con éxito",
            turnoActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al finalizar la atención" });
    }
};


const turnoDelete = async (req = request, res = response) =>{
    const {id} = req.params;

    const turnoBorrado = await Turno.findByIdAndDelete(id);

    res.json({
        msg:"turno eliminado con exito",
        turnoBorrado
    })
}

module.exports = {
    turnosGet,
    turnoPost,
    turnoPut,
    turnoPatch,
    turnoDelete    
}