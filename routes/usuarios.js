const { Router } = require("express");
const { check } = require("express-validator");
const { usuarioExiste, emailExiste, rolExiste } = require("../helpers/db-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { esRolValido } = require("../middlewares/validar-roles");
const { validarJWT } = require("../middlewares/validar-jwt");
const { usuariosGet, usuarioGetID, usuarioPost, usuarioPut, usuarioInhabilitado, usuarioDelete } = require("../controllers/usuarios");

const router = Router();

router.get("/", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO")
], usuariosGet);

router.get("/:id", [
    validarJWT,
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos
], usuarioGetID);

router.post("/", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("nombre", "el nombre es obligatorio").notEmpty(),
    check("apellido", "el apellido es obligatorio").notEmpty(),
    check("telefono", "el telefono es obligatorio").notEmpty(),
    check("password", "el password debe tener un minimo de 8 caracteres").isLength({ min:8 }),
    check("correo").custom(emailExiste),
    check("nivel").custom(rolExiste),//tiene que venir en mayuscula//
    validarCampos
], usuarioPost);

router.put("/:id", [
    validarJWT,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos
], usuarioPut);

router.patch("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos
], usuarioInhabilitado);

router.delete("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos
], usuarioDelete);

module.exports = router;



