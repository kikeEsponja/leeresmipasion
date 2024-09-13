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

//-------------------------- END POINT CATEGORÍAS ----------------------------------
app.get('/api/subjects', async (req, res) => {
  try {
      const query = req.query.query;
      
      const books = await Book.find({
          $or: [
              { title: { $regex: query, $options: 'i' } },
              { author: { $regex: query, $options: 'i' } },
              { subject: { $regex: query, $options: 'i' } }
          ]
      });

      res.json(books);
  } catch (error) {
      console.error('Error al buscar libros:', error);
      res.status(500).send('Error al buscar libros');
  }
});

// Esquema y modelo de Mongoose para Book
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
const Book = mongoose.model('Book', bookSchema);

async function readMetadata(opfFilePath) {
  const metadataContent = await fs.readFile(opfFilePath, 'utf-8');
  const parsedMetadata = await parseStringPromise(metadataContent);
  const metadata = parsedMetadata.package.metadata[0];
  
  // Aqu tienes que asegurarte de que los campos que buscas existen
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
    // return processBooks();
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

const PORT = process.env.PORT || 1028;
httpsServer.listen(PORT, () => {
//app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});