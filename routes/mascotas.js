const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { mascotaExiste } = require("../helpers/db-validator");
const { esRolValido } = require("../middlewares/validar-roles");
const { mascotasGet, mascotaPost, mascotaPut, habilitarMascota, mascotaDelete, mascotasGetIdDueno } = require("../controllers/mascotas");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO")
], mascotasGet);

router.get("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], mascotasGetIdDueno);

router.post("/", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("nombre", "El nombre de la mascota es obligatorio").notEmpty(),
    check("especie", "La especie de la mascota es obligatoria").notEmpty(),
    check("raza", "La raza de la mascota es obligatoria").notEmpty(),
    check("peso", "El peso de la mascota es obligatorio").notEmpty(),
    validarCampos
], mascotaPost);

router.put("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], mascotaPut);

router.patch("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], habilitarMascota);


router.delete("/:id", [
    validarJWT,
    esRolValido("ADMIN", "MEDICO"),
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], mascotaDelete);

module.exports = router;




