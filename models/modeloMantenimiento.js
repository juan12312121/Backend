const db = require('../config/database');
const MaintenanceTypes = require('../constants/mantenimientoConstants'); // Importar las constantes

const Maintenance = {
    create: (data, callback) => {
        // Validamos que el tipo de mantenimiento sea uno de los valores válidos
        if (!Object.values(MaintenanceTypes).includes(data.tipo_mantenimiento)) {
            return callback(new Error('Tipo de mantenimiento inválido'), null);
        }
    
        // Hacemos el JOIN para obtener la marca y el modelo del carro usando el id_carro
        const query = `
            SELECT marca, modelo 
            FROM carros 
            WHERE id = ?`;
    
        db.query(query, [data.id_carro], (err, results) => {
            if (err) {
                return callback(err, null);
            }
    
            // Si no se encuentra el carro con el id proporcionado
            if (results.length === 0) {
                return callback(new Error('Carro no encontrado'), null);
            }
    
            // Extraemos la marca y el modelo del carro
            const { marca, modelo } = results[0];
    
            // Insertamos el mantenimiento. El trigger se encargará de actualizar `gastos_mantenimiento_totales`
            const insertQuery = `
                INSERT INTO mantenimiento (
                    id_carro, tipo_mantenimiento, costo, fecha_mantenimiento, marca, modelo, estado_mantenimiento, gastos, total_gastos
                ) 
                VALUES (?, ?, ?, ?, ?, ?, 'En mantenimiento', ?, ?)`;
    
            // Usamos los valores directamente, no necesitamos calcular totales manualmente
            db.query(
                insertQuery,
                [data.id_carro, data.tipo_mantenimiento, data.costo, data.fecha_mantenimiento, marca, modelo, data.costo, data.costo],
                callback
            );
        });
    },
     

    getAll: (callback) => {
        const query = `
            SELECT m.id_mantenimiento, m.tipo_mantenimiento, m.costo, m.fecha_mantenimiento, m.fecha_creacion, 
                   m.marca, m.modelo, m.gastos, m.estado_mantenimiento, c.marca AS carro_marca, 
                   c.modelo AS carro_modelo, c.id AS id_carro
            FROM mantenimiento m
            LEFT JOIN carros c ON m.id_carro = c.id`;
    
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = `
            SELECT m.id_mantenimiento, m.tipo_mantenimiento, m.costo, m.fecha_mantenimiento, 
                   m.fecha_creacion, m.marca, m.modelo, m.gastos, m.estado_mantenimiento, 
                   c.marca AS carro_marca, c.modelo AS carro_modelo
            FROM mantenimiento m
            LEFT JOIN carros c ON m.id_carro = c.id
            WHERE m.id_mantenimiento = ?`;

        db.query(query, [id], callback);
    },

    update: (id, data, callback) => {
        if (data.tipo_mantenimiento && !Object.values(MaintenanceTypes).includes(data.tipo_mantenimiento)) {
            return callback(new Error('Tipo de mantenimiento inválido'), null);
        }

        const query = `
            UPDATE mantenimiento 
            SET id_carro = ?, tipo_mantenimiento = ?, costo = ?, fecha_mantenimiento = ?, descripcion = ?, mecanico = ? 
            WHERE id_mantenimiento = ?`;

        db.query(query, [data.id_carro, data.tipo_mantenimiento, data.costo, data.fecha_mantenimiento, data.descripcion, data.mecanico, id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM mantenimiento WHERE id_mantenimiento = ?';
        db.query(query, [id], callback);
    },

    calculateTotalGastos: (callback) => {
        const totalQuery = `
            SELECT SUM(gastos) AS total_gastos_mantenimiento
            FROM mantenimiento
            WHERE estado_mantenimiento = 'En mantenimiento'`;

        db.query(totalQuery, callback);
    },

    // Modelo para obtener todos los registros de gastos mantenimiento totales
// Modelo para obtener todos los registros de gastos mantenimiento totales, solo el campo total_gastos
getGastosMantenimientoTotales: (callback) => {
    const query = 'SELECT SUM(total_gastos) AS total_gastos_suma FROM gastos_mantenimiento_totales';

    console.log("Ejecutando consulta SQL:", query); // Log para confirmar que se ejecuta correctamente

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err); // Log para errores
            return callback(err, null); // Llamamos al callback con error
        }

        // Log de los resultados obtenidos para revisar el formato
        console.log("Resultados obtenidos:", JSON.stringify(results, null, 2)); // JSON.stringify para formato más legible

        // Verificamos si el resultado es válido
        if (results && results[0] && results[0].total_gastos_suma !== null) {
            const totalGastos = results[0].total_gastos_suma;
            console.log("Total de gastos:", totalGastos);
            return callback(null, { total_gastos_suma: totalGastos }); // Devolvemos el total en el callback
        } else {
            console.log("No se encontraron resultados o el total es nulo");
            return callback(null, { total_gastos_suma: 0 }); // Si no hay resultados, devolvemos 0
        }
    });
},

updateEstadoByCarId: (id_carro, estado_mantenimiento, callback) => {
    const query = `
        UPDATE mantenimiento
        SET estado_mantenimiento = ?
        WHERE id_carro = ?`;

    db.query(query, [estado_mantenimiento, id_carro], (err, results) => {
        if (err) {
            console.error("Error al ejecutar el query:", err);
            return callback(err, null);
        }
        callback(null, results);
    });
},



};

module.exports = Maintenance;
