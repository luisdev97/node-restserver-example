const express = require('express');

const { verificaToken, verifica_Admin_Role } = require('../middlewares/authentication');

//Todas las funciones que haremos requieren al menos que el usuario este autenticado
//Creacion de 5 servicios
const app = express();


let Categoria = require('../models/Categoria');




//LISTO
//Mostrar todas las categorias
app.get('/categorias', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) throw new Error('No se pudieron obtener las categorias');
            else
                res.json({
                    ok: true,
                    categorias
                });
        });
});










//Muestra una categoria por id, solo la información de la categoría
app.get('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err)
            res.status(400).json({
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








//LISTO
//Crea una nueva categoria y la regresa, al crear una nueva categoria tenemos el id del usuario en el token
app.post('/categorias', verificaToken, (req, res) => {

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) throw new Error(`No se pudo crear la categoria por el siguiente error: \n ${err}`);
        else
            res.json({
                ok: true,
                categoriaDB
            });
    });

});






//LISTO
//Actualizamos solo el nombre/descripcion de la categoría
app.put('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) throw new Error(`No se pudo actualizar la categoria por el siguiente error: \n ${err}`);
        else
            res.json({
                ok: true,
                categoriaDB
            })
    });
});






//LISTO
//Solo un administrador puede borrar categorias
app.delete('/categorias/:id', [verificaToken, verifica_Admin_Role], (req, res) => {
    //Categoria.findByIdAndRemove();
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            })
        else
            res.json({
                ok: true,
                categoriaDB
            });
    });

});




module.exports = app;