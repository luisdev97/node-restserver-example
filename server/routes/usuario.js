const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/Usuario');
const { verificaToken, verifica_Admin_Role } = require('../middlewares/authentication');
//encriptaremos el password de nuestros usuarios antes de realizar el POST
const app = express();



app.get('/', (req, res) => {
    res.json('Welcome to my example REST API in Node.js');
});


//Retorna una lista de los usuarios existentes en la base de datos, requiere de login pero no necesita permisos de administrador
app.get('/usuarios', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

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


//Agrega un usuario a la bd, necesita permisos de administrador
app.post('/usuarios', [verificaToken, verifica_Admin_Role], (req, res) => {

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



//Modifica campos de un usuario, necesita el id para aplicar los cambios a los campos indicados, también requiere de permisos de administrador
app.put('/usuarios/:id', [verificaToken, verifica_Admin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Para recibir el nuevo documento en lugar del original tras realizar los cambios, para esto pasamos como 3 argumento un objeto que contenga new: true 
    //Para evitar que se actualicen campos indebidos en este momento agregarmos al 3 parametro runValidators : true
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        //Retorna error si no existe un usuario cuyo id coincida con el indicado
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


//Modifica el state de un usuario para volverlo inactivo, necesita de un id y requiere permisos de administrador
app.delete('/usuarios/:id', [verificaToken, verifica_Admin_Role], (req, res) => {
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