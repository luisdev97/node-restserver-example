//=====================
//Puerto
//=====================

//Heroku la actualiza por nosotros pero localmente no la tenemos asi que se asiganara 3000
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Vencimiento del token
// ============================
process.env.CADUCIDAD_TOKEN = '1h';


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'this-is-the-dev-seed';


// ============================
//  Base de datos
// ============================

let urlDB;

//En caso de que el enviroment de la aplicación sea dev se usara MongoDB localmente, si está en producción usara la conexión a nuestra base de datos MongoDB Atlas
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGODB_URI;
}


process.env.URLDB = urlDB;




// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '453495567779-c3hel13afg382t257koo38n3orjnrs8m.apps.googleusercontent.com';