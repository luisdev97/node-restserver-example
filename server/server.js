//Cargamos el archivo que configura las variables de entorno
require('./config/config');

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//paquete de node
const path = require('path');

//Cuando vemos el app.use() es un middleware, funciones cada vez que el codigo pase por estas lineas serán ejecutadas


// parse applicatiojn/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json
app.use(bodyParser.json());


//Configuracion global de rutas
app.use(require('./routes/index'));


// habilitar la carpeta public para que se pueda acceder desde cualquier lugar
// el path.resolve lo que hace es mandar segmentos del path y el metodo los monta por nosotros
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));


//Conexion con la base de datos de mongoDB gracias a Mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => console.log(`Escuchando por el puerto: ${process.env.PORT}`));