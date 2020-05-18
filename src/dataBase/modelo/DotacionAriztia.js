const mongoose = require('mongoose');
const { Schema } = mongoose;

const dotacionSchema = new Schema({
  "rut": {type: String},
  "nom_corto": {type: String},
  "nom_comp":  {type: String},
  "nac":  {type: String},
  "ceco":  {type: String},
  "nom_ceco":  {type: String},
});

module.exports = mongoose.model('DotacionAriztia', dotacionSchema);