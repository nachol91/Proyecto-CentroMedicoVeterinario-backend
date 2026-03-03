const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { rolesGet, rolPost, rolInhabilitado, rolDelete } = require("../controllers/roles");
const { nivelExiste } = require("../helpers/db-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const router = Router();

router.get("/",[
    validarJWT,
    esAdminRole
], rolesGet);

router.post("/",[
    validarJWT,
    esAdminRole,
    validarCampos
], rolPost);

router.patch("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(nivelExiste),
    validarCampos
], rolInhabilitado);

router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(nivelExiste),
    validarCampos
], rolDelete);


module.exports = router
