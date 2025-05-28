require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

require('./database/db'); // Importa para probar conexión

app.get('/', (req, res) => {
  res.send('Servidor Express activo y base de datos conectada');
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
