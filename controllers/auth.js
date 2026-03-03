const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login =  async ( req = request, res = response ) =>{
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: "correo o password incorrectos | usuario inexistente" //acordarse de borrar el usuario inexistente, es solo para pruebas//
            })
        }
        

        if(!usuario.estado){
            return res.status(400).json({
                msg: "correo o password incorrectos | usuario inactivo" //acordarse de borrar el usuario inactivo, es solo para pruebas//
            })
        }


        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg: "correo o password incorrectos | password incorrecto" //acordarse de borrar el password incorrecto, es solo para pruebas//
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            msg: "Usuario logueado con exito!",
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "hable con el administrador del sistema"
        })
        
    }
}

module.exports = {
    login
}














