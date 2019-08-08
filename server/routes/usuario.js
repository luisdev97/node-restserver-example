const express = require('express');
const app = express();

//encriptaremos el password de nuestros usuarios antes de realizar el POST
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');


app.get('/', (req, res) => {
    res.json('Hello World');
});


app.get('/usuarios', (req, res) => {
    res.json({
        usuarios: []
    });
});


app.post('/usuarios', (req, res) => {

    let { nombre, email, password, role } = req.body;

    let usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

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

module.exports = app;