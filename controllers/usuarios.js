const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { desde = 0, limite = 20 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.json({
    msg: "Usuarios Obtenidos",
    total,
    usuarios,
  });
};

const usuarioGetID = async (req = request, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);

  res.json({
    msg: "Usuario obtenido",
    usuario,
  });
};

const usuarioPost = async (req = request, res = response) => {
  const datos = req.body;

  const { nombre, apellido, correo, telefono, password } = datos;

  const nivelMays = datos.nivel.toUpperCase();

  const usuario = new Usuario({
    nombre,
    apellido,
    correo,
    telefono,
    password,
    nivel: nivelMays,
  });

  //encriptacion de password//
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  usuario.password = hash;

  await usuario.save();

  res.json({
    msg: "usuario creado correctamente",
    usuario,
  });
};

const usuarioPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { passwordActual, password, correo, telefono, ...resto } = req.body;

  try {
    const usuarioDB = await Usuario.findById(id);

    if (!usuarioDB) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (passwordActual) {
      const validarPass = bcrypt.compareSync(
        passwordActual,
        usuarioDB.password,
      );
      if (!validarPass) {
        return res
          .status(401)
          .json({ msg: "La contraseña actual es incorrecta" });
      }
    }

    if (password && password.length >= 8) {
      const salt = bcrypt.genSaltSync(10);
      resto.password = bcrypt.hashSync(password, salt);
    }

    resto.correo = correo;
    resto.telefono = telefono;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto, {new: true,});

    res.json({
      msg: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error interno, hable con el administrador" });
  }
};

const usuarioInhabilitado = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(400).json({ msg: "no se encontro el usuario" });
    }

    usuario.estado = !usuario.estado;
    await usuario.save();

    res.json({
      msg: `Usuario ${usuario.estado ? "habilitado" : "deshabilitado"} correctamente.`,
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al procesar la solicitud",
    });
  }
};

const usuarioDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const usuarioBorrado = await Usuario.findByIdAndDelete(id);

  res.json({
    msg: "El usuario fue borrado correctamente",
    usuarioBorrado,
  });
};

module.exports = {
  usuariosGet,
  usuarioGetID,
  usuarioPost,
  usuarioPut,
  usuarioInhabilitado,
  usuarioDelete,
};
