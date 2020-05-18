const mongoose = require('mongoose');
const clave = "wrf3G4a6zDFlENBb";
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://marcuxito:'+clave+'@cargadordeturnos-s8utg.mongodb.net/test?retryWrites=true&w=majority', {

//mongoose.connect('mongodb://localhost/turno', {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('DB OK :)'))
  .catch(err => console.error(err));
  dbc = mongoose.connection;

  module.exports = dbc;