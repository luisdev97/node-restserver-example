const express = require('express');
const app = express();

//encriptaremos el password de nuestros usuarios antes de realizar el POST
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/Usuario');


app.get('/', (req, res) => {
    res.json('Hello World');
});



app.get('/usuarios', (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    //Podemos indicar condiciones en el find {google: true}
    Usuario.find({ state: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ state: true }, (err, count) => {

                res.json({
                    ok: true,
                    usuarios,
                    count
                });
            })


        })
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



//Para actualizar podemos usar el modelo Usuario y el metodo findById para traernos el usuario y dentro el Usuario.save
//Otra forma es usar findByIdAndUpdate(id,(err,usuarioDB));
app.put('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Para recibir el nuevo documento en lugar del original tras realizar los cambios, para esto pasamos como 3 argumento un objeto que contenga new: true 
    //Para evitar que se actualicen campos indebidos en este momento agregarmos al 3 parametro runValidators : true
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

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



app.delete('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioEliminado)=> {});
    Usuario.findByIdAndUpdate(id, { $set: { state: false } }, { new: true }, (err, usuarioEliminado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuarioEliminado
        });

    })

});


module.exports = app;