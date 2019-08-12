const express = require('express');

const { verificaToken } = require('../middlewares/authentication');

const app = express();

const Producto = require('../models/Producto');



//Lista todos los productos disponibles de la bd
app.get('/productos', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err)
                res.status(400).json({
                    ok: false,
                    err
                });
            else
                res.json({
                    ok: true,
                    productos
                })
        })

});


//Busca un producto en la base de datos usando su id
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err)
                return res.status(400).json({
                    ok: false,
                    productoDB
                });


            if (!productoDB)
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro un producto con ese id'
                    }
                });


            res.json({
                ok: true,
                productoDB
            });
        });
});



//Busca productos cuyo nombre contenga la palabra enviada en la url
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regEx = new RegExp(termino, 'i');

    Producto.find({ nombre: regEx, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err)
                return res.status(400).json({
                    ok: false,
                    productoDB
                });


            if (!productoDB)
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro un producto con ese nombre'
                    }
                });


            res.json({
                ok: true,
                productoDB
            });

        });

});


//Crea un nuevo producto y lo guerda en la base de datos
app.post('/productos', verificaToken, (req, res) => {

    let { nombre, precioUni, descripcion, disponible, categoria } = req.body;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err)
            res.status(400).json({
                ok: false,
                err
            });
        else
            res.json({
                ok: true,
                productoDB
            });
    });
})



//Modifica campos de un producto, necesita el id en la url
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (!productoDB)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto que intenta actualizar'
                }
            });

        res.json({
            ok: true,
            productoDB
        });

    });

})


//modificar la propiedad disponible de producto a false y no eliminarlo fisicamente, el producto se ha descatalogado
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { $set: { disponible: false } }, { new: true }, (err, productoEliminado) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (!productoEliminado)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro ningun producto con es id'
                }
            });

        res.json({
            ok: true,
            productoEliminado
        });


    })

});



module.exports = app;