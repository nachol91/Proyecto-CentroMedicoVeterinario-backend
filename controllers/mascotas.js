const { response, request } = require("express");
const Mascota = require("../models/mascota");
const cloudinary = require("cloudinary").v2;

const mascotasGet = async ( req=request, res=response ) =>{
    const {desde = 0, limite = 10} = req.query;
    const query = {};

    const [total, mascotas] = await Promise.all([
        Mascota.countDocuments(query),
        Mascota.find(query).skip(desde).limit(limite).populate("dueno", "nombre apellido telefono").populate("medicoQueCrea", "nombre apellido")
    ]);

    res.json({
        msg: "mascotas obtenidas",
        total,
        mascotas,
    });
};

const mascotasGetIdDueno = async ( req = request, res = response ) =>{
    const {idDueno} = req.params;
    
    const mascotas = await Mascota.find({dueno: idDueno}).populate("medicoQueCrea", "nombre apellido");

    res.json({
        msg: "mascotas obtenidas",
        mascotas
    });    
};

const mascotaPost = async ( req = request, res = response) =>{
    const { edad, peso, dueno, historiaClinica, img } = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const especie = req.body.especie.toUpperCase();
    const sexo = req.body.sexo.toUpperCase();
    const raza = req.body.raza.toUpperCase();

    //formateo de la historia clinica//

    let historiaFormateada = "";
    if (historiaClinica) {
        const fecha = new Date().toLocaleDateString('es-AR');
        const { nombre: nombreMedico, apellido: apellidoMedico } = req.usuario; 
        const medicoQueAtiende = `${nombreMedico} ${apellidoMedico}`

        historiaFormateada = `[${fecha}] - Médico: ${medicoQueAtiende}\nNota: ${historiaClinica}\n${'-'.repeat(20)}`;
    }


    //imagen de perfil de la mascota en cloudinary//
    const imagen = async (img) =>{
        try {
            const resultado = await cloudinary.uploader.upload(img);
            return resultado.secure_url;  
        } catch (error) {
            console.error(error)
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
        res.status(500).json({
            msg: "error al procesar la solicitud"
        })
    }
};

const mascotaPut = async ( req = request, res = response) =>{
    const{id} = req.params;

    const { peso, NuevaHistoriaClinica, edad } = req.body;

    const mascotaSelect = await Mascota.findById(id);

    let historiaActualizada = mascotaSelect.historiaClinica;

    if(NuevaHistoriaClinica){
        const fecha = new Date().toLocaleDateString('es-AR');
        
        const { nombre, apellido } = req.usuario;

        const medicoQueAtiende = `${nombre} ${apellido}`;

        const nuevaHistoria = `\n[${fecha}] - Médico: ${medicoQueAtiende}\nNota: ${NuevaHistoriaClinica}\n${'-'.repeat(20)}`;

        historiaActualizada += nuevaHistoria
    }
   
    const mascotaActualizada = await Mascota.findByIdAndUpdate(id, { peso: peso || mascotaSelect.peso, historiaClinica: historiaActualizada, edad: edad || mascotaSelect.edad }, {new: true});

    res.json({
        msg: "registro actualizado con exito!",
        mascotaActualizada
    })
}

const mascotaDelete = async ( req = request, res = response) =>{
    const {id} = req.params;

    const mascotaBorrada = await Mascota.findByIdAndDelete(id);

    // console.log(mascotaBorrada);//

    res.json({
        msg: "Mascota borrada con exito",
        mascotaBorrada
    })
};

module.exports = {
    mascotasGet,
    mascotasGetIdDueno,
    mascotaPost,
    habilitarMascota,
    mascotaPut,
    mascotaDelete
}
            