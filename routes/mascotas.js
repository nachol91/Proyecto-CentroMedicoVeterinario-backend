const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { mascotaExiste } = require("../helpers/db-validator");
const { esAdminRole} = require("../middlewares/validar-roles");
const { mascotasGet, mascotasGetID, mascotaPost, mascotaPut, habilitarMascota, mascotaDelete } = require("../controllers/mascotas");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", [
    validarJWT,
    esAdminRole
], mascotasGet);

router.get("/:id", [
    validarJWT,
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], mascotasGetID);

router.post("/", [
    validarJWT,
    esAdminRole,
    check("nombre", "El nombre de la mascota es obligatorio").notEmpty(),
    check("especie", "La especie de la mascota es obligatoria").notEmpty(),
    check("raza", "La raza de la mascota es obligatoria").notEmpty(),
    check("peso", "El peso de la mascota es obligatorio").notEmpty(),
    check("historiaClinica", "La historia clinica de la mascota es obligatoria").notEmpty(),
    validarCampos
], mascotaPost);

router.put("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], mascotaPut);

router.patch("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], habilitarMascota);


router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "el id no es valido").isMongoId(),
    check("id").custom(mascotaExiste),
    validarCampos
], mascotaDelete);

module.exports = router;




