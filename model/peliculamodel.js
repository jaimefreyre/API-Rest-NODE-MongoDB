const Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

//Model Films 
const PeliculaSchema = new Mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    genro: { type: String },
    reparto: [{ type: Schema.ObjectId, ref: "Actor" }],
    director: { type: Schema.ObjectId, ref: "Director" },
    estreno: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Pelicula', PeliculaSchema);

