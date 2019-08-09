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
//  Base de datos
// ============================
let urlDB;

//En caso de que el enviroment de la aplicación sea dev se usara MongoDB localmente, si está en producción usara la conexión a nuestra base de datos MongoDB Atlas
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://cafeUser:cafequijano@cafecluster-uwbqp.mongodb.net/test?retryWrites=true&w=majority';
}


process.env.URLDB = urlDB;