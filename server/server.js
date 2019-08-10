//Cargamos el archivo que configura las variables de entorno
require('./config/config');

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse applicatiojn/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));

//Cuando vemos el app.use() es un middleware, funciones cada vez que el codigo pase por estas lineas serán ejecutadas

//Conexion con la base de datos de mongoDB gracias a Mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => console.log(`Escuchando por el puerto: ${process.env.PORT}`));