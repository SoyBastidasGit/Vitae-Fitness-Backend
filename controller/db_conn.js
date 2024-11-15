const mariadb = require('mariadb');

// **Variables de Entorno (Mejor Práctica)**
const pool = mariadb.createPool({
    host: process.env.DB_HOST || '31.220.17.192',
    database: process.env.DB_NAME || 'vitae_fitness',
    user: process.env.DB_USER || 'vitae',
    password: process.env.DB_PASSWORD || '#Vitae!123@',
    connectionLimit: 5
});

async function getConnection() {  // Función para obtener una conexión
    try {
        return await pool.getConnection();
    } catch (err) {
        console.error('Error al obtener la conexión a la base de datos:', err);
        throw err; // Re-lanza el error para manejarlo en app.js
    }
}

module.exports = { pool, getConnection }; // Exporta ambos