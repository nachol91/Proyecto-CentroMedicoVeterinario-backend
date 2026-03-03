const { response, request } = require("express");
const Mascota = require("../models/mascota");
const cloudinary = require("cloudinary").v2;

const mascotasGet = async ( req=request, res=response ) =>{
    const {desde = 0, limite = 10} = req.query;
    const query = {estado: true};

    const [total, mascotas] = await Promise.all([
        Mascota.countDocuments(query),
        Mascota.find(query).skip(desde).limit(limite).populate("usuario", "correo"),
    ]);

    res.json({
        msg: "mascotas obtenidas",
        total,
        mascotas,
    });

}

const mascotasGetID = async ( req = request, res = response ) =>{
    const {id} = req.params;

    const mascota = await Mascota.findById(id).populate("usuario", "correo");

    res.json({
        msg: "mascota obtenida",
        mascota
    });
};

const mascotaPost = async ( req = request, res = response) =>{
    const { especie, raza, peso, historiaClinica, img } = req.body;
    const nombre = req.body.nombre.toUpperCase();

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

    const data = { nombre, especie, raza, peso, historiaClinica, img: imgId, usuario: req.usuario._id };

    const mascota = new Mascota(data);

    await mascota.save();

    res.status(201).json({
        msg: "macota creada correctamente.",
        mascota
    })


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
        res.status(200).json({
            msg: "error al procesar la solicitud"
        })
    }
};

const mascotaPut = async ( req = request, res = response) =>{
    const{id} = req.params;

    const { peso, historiaClinica, ...resto } = req.body;

    resto.peso = peso;
    resto.historiaClinica = historiaClinica;

    const mascota = await Mascota.FindByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: "mascota actualizada con exito!",
        mascota
    })
}

const mascotaDelete = async ( req = request, res = response) =>{
    const {id} = req.params;

    const mascotaBorrada = await Mascota.FindByIdAndDelete(id);

    res.json({
        msg: "Mascota borrada con exito",
        mascotaBorrada
    })
};

module.exports = {
    mascotasGet,
    mascotasGetID,
    mascotaPost,
    habilitarMascota,
    mascotaPut,
    mascotaDelete
}
            