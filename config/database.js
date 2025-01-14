const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql-backend-juabngonzalez4-13d9.g.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_kFAEVoDNjL-0U3KaH68',
  database: 'defaultdb',
  port: 26785, // Asegúrate de usar el puerto correcto si es diferente a 3306
  connectTimeout: 10000 // Establece un tiempo de espera para la conexión (en milisegundos)
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = db;
