const bcrypt = require('bcrypt');

const password = 'password';

const encriptado =
  '$2b$10$Hhg3PymMHyADx7tuFcW8C.hRWh5EM7W6tNnu1erGC8LIR6CwwYf62';

const functionHash = async (password) => {
  const prueba = await bcrypt.compare(password, encriptado);

  return prueba;
};

functionHash(password).then((res) => console.log(res));
