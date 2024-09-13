const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 1026;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'leeresmipasion.com',
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

// Middleware para procesar datos JSON
app.use(bodyParser.json());
app.use(cors());

/*connection.query("ALTER TABLE usuarios ADD COLUMN edad INT", (err, result) =>{
    if(err){
        console.error('Error al agregar columna de edad: ', err);
    }else{
        console.log('Columna de edad agregada');
    }
});*/

// Ruta para registrar un nuevo usuario
app.post('/registro', (req, res) => {
  const { nombre, correo, contras, edad } = req.body;

  if (!nombre || !correo || !contras || !edad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  connection.query('SELECT * FROM leer_usuarios WHERE correo = ?', [correo], (err, results) => {
      if(err){
          console.error('error al verificar correo electrónico:', err);
          return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      
      if(results.length > 0){
          return res.status(400).json({ error: 'El correo electrónico ya existe' });
      }
      
      const fechaNac = calcularEdad(edad);
      const mayor = fechaNac >= 18 ? 1 : 0;
      
      const query = 'INSERT INTO leer_usuarios (nombre, correo, contras, edad, mayor) VALUES (?, ?, ?, ?, ?)';
      connection.query(query, [nombre, correo, contras, edad, mayor], (err, result) => {
          if (err) {
              console.error('Error al insertar usuario:', err);
              return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            console.log('Usuario registrado correctamente');
            res.status(201).json({ message: 'Usuario registrado correctamente' });
            });
        });
  });

function calcularEdad(edad){
    const hoy = new Date();
    const fechaNac = new Date(edad);
    let edadUser = hoy.getFullYear() - fechaNac.getFullYear();
    let mes = hoy.getMonth() - fechaNac.getMonth();
    if(mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())){
        edadUser--;
    }
    return edadUser;
}

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

const PORT = process.env.PORT || 1026;
httpsServer.listen(PORT, () => {
//app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});