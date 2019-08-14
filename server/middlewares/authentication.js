const jwt = require('jsonwebtoken');

// ================
// Verificar Token
// ================

//Recibe 3 argumentos, req(solicitud) res(respuesta que se retorna) y el next que lo hace es continuar con la ejecucion del programa
//Lo primero es leer el header personalizado cuya key es Authorization
//Cuando aplicamos un middleware podemos hacer x cantidad de validaciones pero si no ejecutamos el next jamás se ejecutará todo lo que siga después de verificaToken
//La primera verificacion es comprobar que el token es valido el status: 401 es no autorizado
let verificaToken = (req, res, next) => {
    //con req.get se obitnen los headers de la peticion
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        //en el payload del token tenemos el usuario agregamos, se establece en el req. y podrá ser accedido antes de ejecutar cualquier ruta que pase por el middleware
        req.usuario = decoded.usuario;
        next();
    });

};



// ===================================
// Verificar Token para las imagenes
// ===================================

let verificaTokenImg = (req, res, next) => {
    //con req.get se obitnen los headers de la peticion
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        //en el payload del token tenemos el usuario agregamos, se establece en el req. y podrá ser accedido antes de ejecutar cualquier ruta que pase por el middleware
        req.usuario = decoded.usuario;
        next();
    });


};



// ======================
// Verificar ADMIN_ROLE
// ======================

//Usa el token generado para verificar si el usuario tiene el rol de admin
const verifica_Admin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'Solo un administrador esta autorizado para esta accion'
            }
        });
    }
    next()
}


module.exports = {
    verificaToken,
    verifica_Admin_Role,
    verificaTokenImg
}