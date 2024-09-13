const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 1027;

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'leeresmipasion.com',
  user: 'kike',
  password: '',
  database: 'leer_libros'
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT nombre FROM leer_usuarios WHERE correo = ? AND contras = ?';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error al buscar el usuario:', err);
            return res.status(500).json({ error: 'Error al buscar el usuario' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const username = results[0].nombre;
        res.status(200).json({ username });
    });
});

/*const privateKey = fs.readFileSync('../src/certificado/postfix.pem', 'utf-8');
const certificate = fs.readFileSync('../src/certificado/proftpd.pem', 'utf-8');
const credentials = {key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);*/

let privateKey, certificate;

try {
  privateKey = fs.readFileSync('../src/certificado/privkey1.pem', 'utf-8');
} catch (error) {
  console.error("Error reading private key:", error.message);
  process.exit(1);
}

try {
  certificate = fs.readFileSync('../src/certificado/cert1.pem', 'utf-8');
} catch (error) {
  console.error("Error reading certificate:", error.message);
  process.exit(1);
}

const credentials = { key: privateKey, cert: certificate };

let httpsServer;

try {
  httpsServer = https.createServer(credentials, app);
} catch (error) {
  console.error("Error creating HTTPS server:", error.message);
  process.exit(1);
}

const PORT = process.env.PORT || 1027;
httpsServer.listen(PORT, () => {
//app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});