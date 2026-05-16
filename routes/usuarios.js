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
    check("nombre", "el nombre debe tener un minimo de 3 caracteres").isLength({ min:3, max:15 }),
    check("apellido", "el apellido es obligatorio").notEmpty(),
    check("apellido", "el apellido debe tener entre 3 y 15 caracteres").isLength({ min:3, max:15 }),
    check("correo", "el correo no es valido").isEmail(),
    check("correo", "el correo debe tener un maximo de 35 caracteres").isLength({ max:35 }),
    check("telefono", "el telefono es obligatorio").notEmpty(),
    check("telefono", "el telefono debe tener entre 7 y 15 caracteres").isLength({ min:7, max:15 }),
    check("password", "el password debe tener entre 8 y 20 caracteres").isLength({ min:8, max:20 }),
    check("correo").custom(emailExiste),
    check("nivel").custom(rolExiste),
    validarCampos
], usuarioPost);

router.put("/:id", [
    validarJWT,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    check("nombre", "El nombre debe ser texto").optional().notEmpty().isString().isLength({ min:3, max:15 }),
    check("apellido", "El apellido debe ser texto").optional().notEmpty().isString().isLength({ min:3, max:15 }),
    check("correo", "El correo no es válido").optional().isEmail().isLength({ max:35 }),
    check("telefono", "El teléfono es obligatorio").optional().notEmpty().isLength({ min:7, max:15 }),
    check("nivel").custom( valor => {
        if(valor) throw new Error("No podés modificar el nivel por esta ruta");
        return true;
    }),
    check("estado").custom( valor => {
        if(typeof valor !== 'undefined') throw new Error("No podés modificar el estado en esta ruta");
        return true;
    }),
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



