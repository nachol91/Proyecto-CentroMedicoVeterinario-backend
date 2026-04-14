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


const esRolValido = (...niveles) => {
    return (req = request, res = response, next) =>{
        if(!req.usuario){
            return res.status(500).json({
                msg: "es necesario esta logueado"
            })
        }

        if(!niveles.includes(req.usuario.nivel)){
            return res.status(401).json({
                msg: "rol no valido para realizar esta accion!"
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    esRolValido
}