const bcrypt = require('bcrypt');

// Función asincrónica para encriptar
async function encriptar(contraseña) {
    const saltRounds = 10; // Número de rondas de sal, entre más alto, más segura pero más lenta la encriptación
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(contraseña, salt);
    return hash;
}

// Función asincrónica para comparar
async function comparar_encriptracion(contraseña, hash_almacenado) {
    const result = await bcrypt.compare(contraseña, hash_almacenado);
    return result; // Devuelve true si coinciden, false si no
}

module.exports = { encriptar, comparar_encriptracion };