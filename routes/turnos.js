const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esRolValido } = require("../middlewares/validar-roles");
const { turnoExiste } = require("../helpers/db-validator");
const { turnosGet, turnoPost, turnoPut, turnoDelete, turnoPatch, turnosGetIdDueno, turnosGetMisTurnos } = require("../controllers/turnos");

const router = Router();

router.get("/",[
    validarJWT,
    esRolValido("ADMIN", "MEDICO")
], turnosGet);

router.get("/mis-turnos", [
    validarJWT,
    esRolValido("ADMIN", "USER", "MEDICO")
], turnosGetMisTurnos);

router.get("/:idDueno", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("idDueno", "No es un ID válido").isMongoId(),
    validarCampos
], turnosGetIdDueno);

router.post("/",[
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("fecha", "La fecha es obligatoria").notEmpty(),
    check("descripcion", "La descripcion es obligatoria").notEmpty(),
    check("dueno", "No es un ID de usuario válido").isMongoId(),
    check("mascota", "No es un ID de mascota válido").isMongoId(),
    check("medico", "No es un ID de médico válido").isMongoId(),
    check("tipoDeEstudio", "El estudio no es válido").isIn(['CONSULTA GENERAL', 'PRE-QUIRURGICO', 'ECOGRAFIA', 'RADIOGRAFIA', 'ELECTROCARDIOGRAMA']),
    check("estado", "estado invalido").isIn(["PENDIENTE", "REALIZADO", "CANCELADO"]),
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
    check("id").custom(turnoExiste),
    check("estado", "El estado no es válido").optional().isIn(["PENDIENTE", "REALIZADO", "CANCELADO"]),
    check("fecha", "La fecha debe ser válida").optional().isISO8601(),
    check("tipoDeEstudio", "El estudio no puede estar vacío").optional().notEmpty(),
    check("descripcion", "La descripción es obligatoria").optional().notEmpty(),
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

