const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json({ charset: 'utf-8' }));

app.use(cors()); // Habilita CORS para todas las rutas

require('dotenv').config();

app.use(express.json());

// Archivos de controladores
app.use(express.static(path.join(__dirname, 'controller')));

// Rutas
const routes = require('./controller/routes');
app.use('/', routes);

// Puerto de escucha
var port = process.env.PORT || 4000;
app.listen(port, async function () {
    console.log("Entrar a la pagina desde: " + "http://localhost:" + port);
});