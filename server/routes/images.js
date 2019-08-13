const express = require('express');

const fs = require('fs');

const app = express();
const path = require('path');

const { verificaToken } = require('../middlewares/authentication');


app.get('/imagenes/:tipo/:img', (req, res) => {

    let { tipo, img } = req.params;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/imagenotfound.jpg');

    fs.existsSync(pathImagen) ? res.sendFile(pathImagen) : res.sendFile(noImagePath);

});

module.exports = app;