const { v4: uuidv4 } = require('uuid');

async function generar_referencia() {
    const referencia = uuidv4();
    return referencia;
}

module.exports = generar_referencia;