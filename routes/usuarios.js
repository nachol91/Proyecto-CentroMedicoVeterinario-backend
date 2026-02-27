const { Router } = require("express");
const { usuariosGet, usuarioGetID, usuarioPost, usuarioPut, usuarioInhabilitado, usuarioDelete } = require("../controllers/usuarios");
const { check } = require("express-validator");








const router = Router();

router.get("/",usuariosGet);

router.get("/:id", [
    check("id", "el id no es valido").isMongoId(),
], usuarioGetID);

router.post("/", [
    check("nombre", "el nombre es obligatorio").notEmpty(),
    check("apellido", "el apellido es obligatorio").notEmpty(),
    check("telefono", "el telefono es obligatorio").notEmpty(),
    check("password", "el password debe tener un minimo de 8 caracteres").isLength({ min:8 })
], usuarioPost);

router.put("/:id", [
    check("id", "no es un id valido").isMongoId()
], usuarioPut);

router.patch("/:id", [
    check("id", "el id no es valido").isMongoId()
], usuarioInhabilitado);

router.delete("/:id", [
    check("id", "el id no es valido").isMongoId()
], usuarioDelete);

module.exports = router;



