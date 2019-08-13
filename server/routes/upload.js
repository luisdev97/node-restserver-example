const express = require('express');
const fileUpload = require('express-fileupload');

const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

const app = express();

const fs = require('fs'); //necesitamos construir un path para llegar a las imagenes desde las rutas
const path = require('path');

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


    let tiposValidos = ['productos', 'usuarios'];
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


    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, err => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Imagen cargada

        tipo === 'usuarios' ? imagenUsuario(id, res, nombreArchivo) : imagenProducto(id, res, nombreArchivo);

    });

});






const imagenProducto = (id, res, nombreArchivo) => {



    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe por lo que no puede subirse la imagen'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado,
                img: nombreArchivo
            })
        })


    });


}























const imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!usuarioDB) {

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }


        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;



        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}






















const borrarArchivo = (nombreImagen, tipo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen))
        fs.unlinkSync(pathImagen);
}


module.exports = app;