require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Cuando vemos el app.use() son middleware, funciones cada vez que el codigo pase por estas lineas

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json('Hello World');
});



app.get('/usuarios', (req, res) => {
    res.json({
        usuarios: []
    });
});



app.post('/usuarios', (req, res) => {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            body
        });
    }

});



app.put('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});



app.delete('/usuarios/:id', (req, res) => {

    let id = req.params.id;

    res.json(`delete usuario: ${id}`);
});



app.listen(process.env.PORT, () => console.log('escuchando por el puerto 3000'));