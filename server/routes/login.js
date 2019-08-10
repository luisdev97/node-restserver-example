const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');


const app = express();


//Ruta POST para el login, necesita de un email y el password para el acceso a una cuenta de usuario
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Retorna error si no se encuentra un usuario con el email indicado
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        //Retorna error si las contraseñas no coinciden
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }


        //Generamos el JSON web token antes de enviarlo, mandamos el payload o informacion que queremos guardar en el token, luego viene el secret que sirve para verificar posteriormente que coincide el secret del token con el secret que usamos en el servidor 
        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });


});


module.exports = app;