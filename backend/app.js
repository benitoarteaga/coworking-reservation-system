const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const citaRoutes = require('./routes/citaRoutes');
const tipoCitaRoutes = require('./routes/tipoCitaRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Para manejar preflight requests OPTIONS
// app.options('*', cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

app.use(express.json());

app.use(session({
  secret: 'clave_super_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/tipos-cita', tipoCitaRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada o sin permisos.' });
});

app.listen(4000, () => {
  console.log('✅ Servidor backend corriendo en http://localhost:4000');
});
