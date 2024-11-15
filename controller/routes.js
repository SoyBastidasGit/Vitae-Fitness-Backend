const express = require('express');
const router = express.Router();
const { getConnection } = require('./db_conn');
const { encriptar, comparar_encriptracion } = require('./bcrypt');

// Ruta logica para registrar un usuario
router.put('/registerUser', async (req, res) => {
    const conn = await getConnection();

    try {
        const name = req.body.nombre;
        const lastname = req.body.apellido;
        const birthdate = req.body.birthdate;
        const email = req.body.email;
        const password_bcrypt = await encriptar(req.body.password);

        // Inicia la transacción
        await conn.beginTransaction();

        // Inserción en la tabla `usuarios`
        await conn.query(`
            INSERT INTO
                usuarios
                (nombre, apellido, fecha_nacimiento, correo, contrasena)
            VALUES
                (?, ?, ?, ?, ?)
        `, [
            name,
            lastname,
            birthdate,
            email,
            password_bcrypt,
        ]);

        // Confirma la transacción
        await conn.commit();

        res.status(201).json(
            {
                'message': 'Usuario creado correctamente'
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
    } finally {
        // Siempre libera la conexión, incluso en caso de errores
        conn.release();
    }
});

// Ruta logica de inicio de sesion
router.post("/login", async (req, res) => {
    const conn = await getConnection();
    try {
        const email = req.body.email;
        const password = req.body.password;

        const result = await conn.query(`
            SELECT
                *
            FROM
                usuarios
            WHERE
                usuarios.correo = (?)`, [email]);

        if (result.length > 0) {
            const email_comparar_bcrypt = await comparar_encriptracion(password, result[0].contrasena);

            if (email_comparar_bcrypt && result.length > 0) {
                res.status(200).json(
                    {
                        'message': 'Autorizado', result
                    }
                );
            } else {
                res.status(401).json(
                    {
                        'message': 'Contraseña incorrecta'
                    }
                );
            }
        } else {
            res.status(401).json(
                {
                    'message': 'Correo electronico incorrecto'
                }
            );
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
    } finally {
        conn.release();
    }
});

// Ruta logica para registrar un usuario
router.put('/resetPassword', async (req, res) => {
    const conn = await getConnection();

    try {
        const email = req.body.email;
        const new_password_bcrypt = await encriptar(req.body.password);

        // Inicia la transacción
        await conn.beginTransaction();

        // Inserción en la tabla `usuarios`
        await conn.query(`
            UPDATE usuarios
            SET contrasena = ?
            WHERE correo = ?
        `, [
            new_password_bcrypt,
            email,
        ]);

        // Confirma la transacción
        await conn.commit();

        res.status(201).json(
            {
                'message': 'Contraseña actualizada correctamente'
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
    } finally {
        // Siempre libera la conexión, incluso en caso de errores
        conn.release();
    }
});

// Ruta logica de inicio de sesion
router.post("/profileUser", async (req, res) => {
    const conn = await getConnection();
    try {
        const email = req.body.email;

        const result = await conn.query(`
            SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                fecha_nacimiento,
            FROM
                usuarios
            WHERE
                usuarios.correo = (?)`, [email]);

        res.status(200).json(
            {
                'message': 'Autorizado', result
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
    } finally {
        conn.release();
    }
});

// Ruta logica de inicio de sesion
router.put("/updateProfile", async (req, res) => {
    const conn = await getConnection();
    try {
        const name = req.body.name;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const old_email = req.body.old_email;

        await conn.query(`
            UPDATE usuarios
            SET 
                nombre = ?,
                apellido = ?,
                correo = ?
            WHERE 
                correo = ?;
        `, [name, lastname, email, old_email]);

        const result = await conn.query(`
            SELECT
                nombre,
                apellido,
                correo
            FROM
                usuarios
            WHERE
                usuarios.correo = (?)`, [email]);

        res.status(200).json(
            {
                'message': 'Autorizado', result
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
    } finally {
        conn.release();
    }
});

module.exports = router;