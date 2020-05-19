const mongoose = require('mongoose');
const { Schema } = mongoose;

const usrFurgonSchema = new Schema({
  "rut": {type: String},
  "nom_completo": {type: String},
  "nacionalidad": {type: String},
  "ceco": {type: String},
  "nom_ceco": {type: String},
  "furgon": {type: String},
  "chofer": {type: String},
  "evento": {type: String},
  "localidad": {type: String},
  "fecha": {type: String},
});



module.exports = mongoose.model('UsrFurgones', usrFurgonSchema);