const jwt =  require("jsonwebtoken");

const generarJWT = (uid) =>{
    return new Promise((resolve, reject) =>{
        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {expiresIn : "1h"}, (error, token) =>{
            if(error){
                reject("no se puede generar el token")
            } else {
                resolve(token);
            }})
    })
};

module.exports = {
    generarJWT
}