const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esRolValido } = require("../middlewares/validar-roles");
const { usuarioExiste, mascotaExiste, turnoExiste } = require("../helpers/db-validator");
const { turnosGet, turnoPost, turnoPut, turnoDelete, turnoPatch } = require("../controllers/turnos");


const router = Router();

router.get("/",[
    validarJWT,
    esRolValido("ADMIN", "MEDICO")
], turnosGet);

router.post("/",[
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("fecha", "La fecha es obligatoria").notEmpty(),
    check("descripcion", "La descripcion es obligatoria").notEmpty(),
    validarCampos
], turnoPost);

router.put("/:id",[
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(turnoExiste),
    validarCampos
], turnoPut);

router.patch("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "No es un ID de Mongo válido").isMongoId(),
    check("id").custom(turnoExiste), // Este es el que busca el ID real en la BD
    validarCampos
], turnoPatch);

router.delete("/:id",[
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(turnoExiste),
    validarCampos
], turnoDelete);

module.exports = router;
