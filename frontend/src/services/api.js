const express = require('express');
const multer  = require('multer');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors()); 

// Configurar dónde se guardan las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // carpeta donde se guardan
    },
    filename: function (req, file, cb) {
        // nombre único para cada imagen
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Crear la ruta que recibe la imagen
app.post('/upload', upload.single('imagen'), (req, res) => {
    // req.file tiene toda la info de la imagen
    console.log('Imagen recibida:', req.file);

    res.json({
        mensaje: '¡Imagen recibida con éxito!',
        archivo: req.file.filename
    });
});

//  Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});