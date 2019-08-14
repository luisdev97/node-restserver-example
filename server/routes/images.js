const express = require('express');

const fs = require('fs');

const app = express();
const path = require('path');

const { verificaTokenImg } = require('../middlewares/authentication');


app.get('/imagenes/:tipo/:img', verificaTokenImg, (req, res) => {

    let { tipo, img } = req.params;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/imagenotfound.jpg');

    fs.existsSync(pathImagen) ? res.sendFile(pathImagen) : res.sendFile(noImagePath);

});

module.exports = app;