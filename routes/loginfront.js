const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas (instálalo con npm install bcrypt)
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3004;

const connection = mysql.createConnection({
    host: 'leresmipasion.com',
    user: 'kike',
    password: '',
    database: 'leer_libros'
  });
  
  // Conexión a la base de datos
  connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos exitosa');
  });
// Datos de ejemplo de usuario (esto debería estar en tu base de datos)
const users = [
    //{ id: 1, email: 'a@gmail.com', password: '123' } // Contraseña: password
];

app.use(bodyParser.json());
app.use(cors()); // Configurar CORS

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Buscar al usuario por correo electrónico en los datos de ejemplo
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña utilizando bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Si la contraseña es correcta, inicio de sesión exitoso
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
        window.location.href = '../index.html';
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
