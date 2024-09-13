const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { parseStringPromise } = require('xml2js');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.json());

//------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//------------------------------------------------------------------------------

//------------------------- ENDPOINT PRINCIPAL ---------------------------------
app.get('/api/books', async (req, res) => {
    try {
        // Obtener 30 libros aleatorios
        const books = await Book.aggregate([{ $sample: { size: 200 } }]);
        res.json(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).send('Error al obtener libros');
    }
});
//------------------------------------------------------------------------------

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  date: Date,
  description: String,
  subject: String,
  cover: String,
  urlpdf: String
});
const Book = mongoose.model('Book', bookSchema, 'books');

async function readMetadata(opfFilePath) {
  const metadataContent = await fs.readFile(opfFilePath, 'utf-8');
  const parsedMetadata = await parseStringPromise(metadataContent);
  const metadata = parsedMetadata.package.metadata[0];
  
  return {
    id: metadata['dc:identifier']?.[0]?.['_'] ?? '',
    title: metadata['dc:title']?.[0] ?? '',
    author: metadata['dc:creator']?.[0]?.['_'] ?? '',
    date: new Date(metadata['dc:date']?.[0] ?? ''),
    description: metadata['dc:description']?.[0] ?? '',
    subject: metadata['dc:subject']?.[0] ?? ''
  };
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
  });

/*const privateKey = fs.readFileSync('../src/certificado/postfix.pem', 'utf-8');
const certificate = fs.readFileSync('../src/certificado/proftpd.pem', 'utf-8');
const credentials = {key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);*/

let privateKey, certificate;

try {
  privateKey = fs.readFileSync('./src/certificado/privkey1.pem', 'utf-8');
} catch (error) {
  console.error("Error reading private key:", error.message);
  process.exit(1);
}

try {
  certificate = fs.readFileSync('./src/certificado/cert1.pem', 'utf-8');
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

const PORT = process.env.PORT || 3000;
httpsServer.listen(PORT, () => {
//app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});