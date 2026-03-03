const { request, response } =  require("express");

const esAdminRole = ( req = request, res = response, next ) =>{
    if(!req.usuario){
        return res.status(500).json({
            msg: "debe tener un token valido para validar el rol"
        })
    };

    const {nivel, nombre, apellido} = req.usuario;

    if (nivel !== "ADMIN"){
        return res.status(401).json({
            msg: `${nombre} ${apellido} no es administrador del sistema` 
        })
    };

    next();
};

module.exports = {
    esAdminRole
}