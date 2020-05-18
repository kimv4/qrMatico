const mongoose = require('mongoose');
const { Schema } = mongoose;

const usrFurgonSchema = new Schema({
  "rut": {type: String},
  "nom_comp":  {type: String},
  "ceco": {type: String},
  "nom_ceco": {type: String},
  "evento":{type: String},
  "localidad":{type: String},
  "furgon":{type: String},
  "driver": {type: String, fechaactual},
});

function fechaactual(){
  var fecha = new Date();
  var dd=fecha.getDay();
  var mm=fecha.getMonth();
  var yyyy=fecha.getFullYear()
  var hh=fecha.getHours();
  var mi=fecha.getMinutes();
  return dd+"/"+mm+"/"+yyyy+" "+hh+":"+mi;
}

module.exports = mongoose.model('UsrFurgones', usrFurgonSchema);