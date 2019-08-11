const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Imports para la autenticacion con Google
const { OAuth2Client } = require('google-auth-library');
//como CLIENT_ID usará una variable de entorno
const client = new OAuth2Client(process.env.CLIENT_ID);

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



//Configuraciones de Google
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,

    });

    const { name: nombre, email, picture: img } = ticket.getPayload();

    return {
        nombre,
        email,
        img,
        google: true
    }

}





app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {

            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                //Si es un usuario autenticado por Google previamente renovamos su token
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe en nuestra base de datos
        }

        let usuario = new Usuario();
        const { nombre, email, img, google } = googleUser;

        usuario.nombre = nombre;
        usuario.email = email;
        usuario.img = img;
        usuario.google = google;
        usuario.password = ':)'

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let token = jwt.sign({
                usuario: usuarioDB,
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });

        });

    });


})


module.exports = app;