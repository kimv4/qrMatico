const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
 
//consfiguraciones
app.set('port', process.env.PORT || 5550);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ruta
app.use('/scan', require('./src/ruta/rutas'));

//ruta statica
app.use(express.static(path.join(__dirname, 'src/public')));

//inicia el servidor
app.listen(app.get('port'), ()=>{
  console.log(`on Port ${app.get('port')}`);
});