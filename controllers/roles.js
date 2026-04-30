const { request, response } = require("express");
const Rol = require("../models/rol");

const rolesGet = async ( req = request, res = response ) => {
    const { desde = 0, limite = 5 } = req.query;
    const query = { estado: true };

    try {
        const [total, roles] = await Promise.all([
        Rol.countDocuments(query),
        Rol.find(query).skip(desde).limit(limite)
    ]);

    res.json({
        msg: "Roles Obtenidos",
        total,
        roles
    });
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"})
    };
};

const rolPost = async ( req=request, res=response )=>{
    const nivel = req.body.nivel.toUpperCase();

    try {
        const nivelDB = await Rol.findOne({nivel});

        if(nivelDB){
            return res.status(400).json({
                msg: `el rol ${nivelDB} ya existe.`
            })
        }

        const data = {nivel};

        const rol = new Rol(data);

        await rol.save();

        res.status(201).json({
            msg: `Rol ${rol.nivel} creado correctamente`,
            rol
        });    
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"})
    };    
};

const rolInhabilitado = async ( req = request, res = response ) =>{
    const {id} = req.params;

    try {
        const nivel = await Rol.findById(id);

        if(!nivel){
            return res.status(400).json({msg: "no se encontro el rol buscado"});
        }

        nivel.estado = !nivel.estado;
        await nivel.save();

        res.json({
            msg: `rol ${ nivel.estado ? "habilitado" : "deshabilitado"} correctamente.`,
            nivel 
        });
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"})        
    };
};

const rolDelete = async ( req = request, res = response ) =>{
    const {id} = req.params;

    try {
        const rolBorrado = await Rol.findByIdAndDelete(id);

        res.json({
            msg: "El rol fue borrado correctamente",
            rolBorrado
        });    
    } catch (error) {
        res.status(500).json({msg: "Error al procesar la solicitud"})  
    };    
}

module.exports = {
    rolesGet,
    rolPost,
    rolInhabilitado,
    rolDelete
}
