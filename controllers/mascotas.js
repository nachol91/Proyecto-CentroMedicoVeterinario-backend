const { response, request } = require("express");
const Mascota = require("../models/mascota");
const cloudinary = require("cloudinary").v2;

const mascotasGet = async ( req=request, res=response ) =>{
    const {desde = 0, limite = 20} = req.query;
    const query = {};

    try {
        const [total, mascotas] = await Promise.all([
            Mascota.countDocuments(query),
            Mascota.find(query).skip(desde).limit(limite).populate("dueno", "nombre apellido telefono correo").populate("medicoQueCrea", "nombre apellido")
        ]);

        res.json({
            msg: "mascotas obtenidas",
            total,
            mascotas,
        });
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"});
    }; 
};

const mascotasGetIdDueno = async ( req = request, res = response ) =>{
    const {idDueno} = req.params;
    
    try {
       const mascotas = await Mascota.find({dueno: idDueno}).populate("medicoQueCrea", "nombre apellido");

        res.json({
            msg: "mascotas obtenidas",
            mascotas
        });     
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"});
    }    
};

const mascotaPost = async ( req = request, res = response) =>{
    const { edad, peso, dueno, historiaClinica, img } = req.body;

    try {
        const nombre = req.body.nombre.toUpperCase();
        const especie = req.body.especie.toUpperCase();
        const sexo = req.body.sexo.toUpperCase();
        const raza = req.body.raza.toUpperCase();

        let historiaFormateada = "";
        if (historiaClinica) {
            const fecha = new Date().toLocaleDateString('es-AR');
            const { nombre: nombreMedico, apellido: apellidoMedico } = req.usuario; 
            const medicoQueAtiende = `${nombreMedico} ${apellidoMedico}`;
            historiaFormateada = `[${fecha}] - Médico: ${medicoQueAtiende}\nNota: ${historiaClinica}\n${'-'.repeat(20)}`;
        };

        const imagen = async (img) =>{
            try {
                const resultado = await cloudinary.uploader.upload(img);
                return resultado.secure_url;  
            } catch (error) {
                throw error;
            }
        };

        const imgId = await imagen(img);

        const medicoQueCrea = req.usuario._id

        const data = { nombre, especie, raza, edad, peso, sexo, historiaClinica: historiaFormateada, img: imgId,  medicoQueCrea, dueno};

        const mascota = new Mascota(data);

        await mascota.save();

        res.status(201).json({
            msg: "macota creada correctamente.",
            mascota
        });    
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"});
    };
};

const habilitarMascota = async ( req = request, res = response) =>{
    
    const {id} = req.params;

    try {
        const mascota = await Mascota.findById(id);

        if(!mascota){
            return res.status(404).json({ msg: "mascota no encontrada" })
        }

        mascota.estado = !mascota.estado;
        await mascota.save();

        res.status(200).json({
            msg: `La mascota fue ${mascota.estado ? "habilitada" : "deshabilitada"} con exito!`,
            mascota
        });

    } catch (error) {
        res.status(500).json({msg: "error al procesar la solicitud"})
    };
};

const mascotaPut = async ( req = request, res = response) =>{
    const{id} = req.params;
    const { peso, NuevaHistoriaClinica, edad } = req.body;

    try {
        const mascotaSelect = await Mascota.findById(id);

        let historiaActualizada = mascotaSelect.historiaClinica;

        if(NuevaHistoriaClinica){
            const fecha = new Date().toLocaleDateString('es-AR');
            
            const { nombre, apellido } = req.usuario;

            const medicoQueAtiende = `${nombre} ${apellido}`;

            const nuevaHistoria = `\n[${fecha}] - Médico: ${medicoQueAtiende}\nNota: ${NuevaHistoriaClinica}\n${'-'.repeat(20)}`;

            historiaActualizada += nuevaHistoria
        };
    
        const mascotaActualizada = await Mascota.findByIdAndUpdate(id, { peso: peso || mascotaSelect.peso, historiaClinica: historiaActualizada, edad: edad || mascotaSelect.edad }, {new: true});

        res.json({
            msg: "registro actualizado con exito!",
            mascotaActualizada
        });    
    } catch (error) {
        res.status(500).json({msg: "error al procesar la solicitud"})
    };    
};

const mascotaDelete = async ( req = request, res = response) =>{
    const {id} = req.params;

    try {
        const mascotaBorrada = await Mascota.findByIdAndDelete(id);

        res.json({
            msg: "Mascota borrada con exito",
            mascotaBorrada
        });    
    } catch (error) {
        res.status(500).json({msg: "error al procesar la solicitud"})  
    };    
};

const mascotasGetMisMascotas = async (req = request, res = response) => {
    const { _id } = req.usuario;

    try {
        const mascotas = await Mascota.find({ dueno: _id })
            .populate("medicoQueCrea", "nombre apellido");

        res.json({
            msg: "Tus mascotas obtenidas con éxito",
            mascotas
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener tus mascotas" });
    }
};

module.exports = {
    mascotasGet,
    mascotasGetIdDueno,
    mascotaPost,
    habilitarMascota,
    mascotaPut,
    mascotasGetMisMascotas,
    mascotaDelete
}

