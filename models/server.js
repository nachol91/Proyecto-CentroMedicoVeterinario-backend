const express = require("express");
const cors = require("cors");
const {dbConnection} = require("../database/config");

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.authPath = "/api/auth";
        this.mascotasPath = "/api/mascotas";
        this.usuariosPath = "/api/usuarios";
        this.rolesPath = "/api/roles";
        this.turnosPath = "/api/turnos";
        
        
        this.conectarDB();

        this.middlewares();        

        this.routes();
    };

    async conectarDB(){
        await dbConnection();
    };

    middlewares(){
        
        this.app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
        
        this.app.use(express.json());
        
        this.app.use(express.static("public"));
    };

    routes(){
        this.app.use(this.authPath, require("../routes/auth"));
        this.app.use(this.mascotasPath, require("../routes/mascotas"));
        this.app.use(this.usuariosPath, require("../routes/usuarios"));
        this.app.use(this.rolesPath, require("../routes/roles"));
        this.app.use(this.turnosPath, require("../routes/turnos"));
        
    };

    listen(){
        this.app.listen(this.port, () =>{
            console.log("server online en el puerto ", this.port);
        })
    }

}

module.exports = Server;
