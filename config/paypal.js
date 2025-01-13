const paypal = require('paypal-rest-sdk');

// Configuración de PayPal
paypal.configure({
  mode: 'sandbox', // Cambia a 'live' cuando vayas a producción
  client_id: 'AUagctJ0-I6lVcmXn_d9V8HZUpJ7JGtPHB63Xd1nL1epIEQSbwcaw_bXez1fkNWCWK4_-Ca7Cd_lgmj5', // Reemplaza con tu Client ID
  client_secret: 'EJBUWLvQVXtEoojtF5jrBYFs9sCSjrh0GE0dH_tWJ5b_WJe4GrqL5hmv6M65u-pvgtI0XZNII4b5yEin' // Reemplaza con tu Secret
});

module.exports = paypal;
