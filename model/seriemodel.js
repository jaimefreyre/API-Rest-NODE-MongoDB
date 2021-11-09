const Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
// var Temporada = Mongoose.model('Temporada');

const SerieSchema = new Mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    genro: { type: String}
});

module.exports = Mongoose.model('Serie', SerieSchema);