const express = require("express");
const cors = require("cors");
const {dbConnection} = require("../database/config");

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.authPath = "./api/auth";
        this.mascotasPath = "./api/mascotas";
        this.usuariosPath = "./api/usuarios";

        //Contectar a la base de datos//
        
        this.conectarDB();

        //middlewares//

        this.middlewares();

        //funcion rutas//

        this.routes();
    };

    async conectarDB(){
        await dbConnection();
    };

    middlewares(){
        //cors//
        this.app.use(cors());

        //leer envio por el cuerpo de la peticion //
        this.app.use(express.json());

        //carpeta publica//
        this.app.use(express.static("public"));
    };

    routes(){
        this.app.use(this.authPath, require("../routes/auth"));
        this.app.use(this.mascotasPath, require("../routes/mascotas"));
        this.app.use(this.usuariosPath, require("../routes/usuarios"));
    };

    listen(){
        this.app.listen(this.port, () =>{
            console.log("server online en el puerto ", this.port);
        })
    }

}

module.exports = Server;
