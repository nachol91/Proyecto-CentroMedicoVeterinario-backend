const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const Mascota = require("../models/mascota");

//validacion de email//

const emailExiste = async (correo) => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(
      `El correo ${correo} ya se encuentra registrado en la base de datos`,
    );
  }
};

//validacion de Rol//

const rolExiste = async (nivel) => {
  const nivelMays = nivel.toUpperCase();
  nivel = nivelMays;
  const existeRol = await Rol.findOne({ nivel });
  if (!existeRol) {
    throw new Error(`El rol ${nivel} no se encuentra en la base de datos`);
  }
};

//validacion de existencia del rol en la base de datos//

const nivelExiste = async (id) => {
  const existeNivel = await Rol.findById(id);
  if (!existeNivel) {
    throw new Error(
      `el id ${id} no corresponde al de ningun rol en la base de datos`,
    );
  }
};

//validacion de existencia del usuario en la base de datos//

const usuarioExiste = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(
      `el id ${id} no corresponde a un usuario registrado en la base de datos`,
    );
  }
};

//validacion de existencia de mascota//

const mascotaExiste = async (id) => {
  const existeMascota = await Mascota.findById(id);
  if (!existeMascota) {
    throw new Error(
      `el id ${id} no corresponde a ninguna mascota de la base de datos`,
    );
  }
};

module.exports = {
  emailExiste,
  rolExiste,
  usuarioExiste,
  mascotaExiste,
  nivelExiste,
};
