const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { rolesGet, rolPost, rolInhabilitado, rolDelete } = require("../controllers/roles");
const { nivelExiste } = require("../helpers/db-validator");




const router = Router();

router.get("/", rolesGet);

router.post("/",[
    validarCampos
], rolPost);

router.patch("/:id",[
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(nivelExiste),
    validarCampos
], rolInhabilitado);

router.delete("/:id",[
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(nivelExiste),
    validarCampos
], rolDelete);


module.exports = router
