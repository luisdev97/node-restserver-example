const express = require('express');
const fileUpload = require('express-fileupload');

const Usuario = require('../models/Usuario');

const app = express();


//default options
app.use(fileUpload());

//podemos enviar imagenes de usuario y de productos
app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ningun archivo ha sido seleccionado'
            }
        });


    let tiposValidos = ['productos', 'usuario'];
    //Valida el tipo

    if (tiposValidos.indexOf(tipo) === -1)
        return res.status(400).json({
            ok: false,
            err: {
                message: `Solo se permiten los tipos: ${tiposValidos.join(', ')} `
            }
        });




    //Si viene un archivo caera dentro de re.files.sampleFile
    let archivo = req.files.archivo;
    let extensionArchivo = archivo.name.split('.')[1];
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;

    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) === -1)
        return res.status(400).json({
            ok: false,
            err: {
                message: `Solo se permiten las extensiones: ${extensionesValidas.join(', ')} `
            }
        });


    archivo.mv(`./uploads/${tipo}/${nombreArchivo}.jpg`, err => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });

    });

});


module.exports = app;