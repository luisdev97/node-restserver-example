const express = require('express');
const app = express();

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

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
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