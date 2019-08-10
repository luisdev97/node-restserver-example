const jwt = require('jsonwebtoken');

// ================
// Verificar Token
// ================

//Recibe 3 argumentos, req(solicitud) res(respuesta que se retorna) y el next que lo hace es continuar con la ejecucion del programa
//Lo primero es leer el header personalizado cuya key es Authorization
//Cuando aplicamos un middleware podemos hacer x cantidad de validaciones pero si no ejecutamos el next jamás se ejecutará todo lo que siga después de verificaToken
//La primera verificacion es comprobar que el token es valido el status: 401 es no autorizado
let verifificaToken = (req, res, next) => {
    //con req.get obtengo los headers de la peticion
    let token = req.get('Authorization');
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        //en el payload del token tenemos el usuario
        req.usuario = decoded.usuario;
        next();
    });


};

module.exports = verifificaToken;