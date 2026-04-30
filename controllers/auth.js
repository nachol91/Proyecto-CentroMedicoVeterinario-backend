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
                msg: "correo o password incorrectos"
            })
        }        

        if(!usuario.estado){
            return res.status(400).json({
                msg: "correo o password incorrectos"
            })
        }

        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg: "correo o password incorrectos -- pasword"
            })
        }

        const token = await generarJWT(usuario.id);

        const { password: pass, ...usuarioSinPassword } = usuario._doc;

        res.json({
            msg: "Usuario logueado con exito!",
            usuario: usuarioSinPassword,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: "hable con el administrador del sistema"
        })
        
    }
}

module.exports = {
    login
}














