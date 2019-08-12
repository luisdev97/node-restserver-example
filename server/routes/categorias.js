const express = require('express');

const { verificaToken, verifica_Admin_Role } = require('../middlewares/authentication');

//Todas las funciones que haremos requieren al menos que el usuario este autenticado
//Creacion de 5 servicios
const app = express();


let Categoria = require('../models/Categoria');




//Mostrar todas las categorias así como algunos datos del usuario que la creo
app.get('/categorias', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            else
                res.json({
                    ok: true,
                    categorias
                });
        });
});










//Muestra una categoria cuyo id sea igual al pasado en la url
app.get('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err)
            res.status(500).json({
                ok: false,
                err
            });
        else
            res.json({
                ok: true,
                categoriaDB
            });
    });
});




//Crea una nueva categoria y la regresa, al crear una nueva categoria tenemos el id del usuario en el token
app.post('/categorias', verificaToken, (req, res) => {

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err)
            return res.status(400).json({
                ok: false,
                err
            });


        res.json({
            ok: true,
            categoriaDB
        });
    });

});




//Actualizamos solo la descripcion de la categoría, requiere pasar el id en la url
app.put('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (!categoriaDB)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe una categoría en la base da datos con ese id'
                }
            });

        res.json({
            ok: true,
            categoriaDB
        });

    });
});




//Eliminamos una categoría pasando el id en la url, Solo un administrador puede borrar categorias
app.delete('/categorias/:id', [verificaToken, verifica_Admin_Role], (req, res) => {
    //Categoria.findByIdAndRemove();
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (!categoriaDB)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe una categoría en la base da datos con ese id'
                }
            });

        res.json({
            ok: true,
            categoriaDB
        });
    });

});




module.exports = app;