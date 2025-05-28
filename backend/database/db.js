const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgres',        // el nombre del contenedor en Docker
  user: 'postgres',
  password: '123456',
  database: 'medical_appointments_db',    // si no especificaste otro, es el default
  port: 5432
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión a PostgreSQL', err));

module.exports = pool;
