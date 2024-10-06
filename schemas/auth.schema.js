const Joi = require('joi');

const token = Joi.string().min(8).max(200);
const newPassword = Joi.string().min(8);

const changeAuthPassword = Joi.object({
  token: token.required(),
  newPassword: newPassword.required(),
}).preferences({
  stripUnknown: true, // Elimina claves que no están definidas en el esquema
});

module.exports = { changeAuthPassword };
