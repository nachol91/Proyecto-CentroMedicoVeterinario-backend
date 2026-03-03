const { Router } = require("express");
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

module.exports = router;