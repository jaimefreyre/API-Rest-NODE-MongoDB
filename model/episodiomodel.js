const Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

const EpisodioSchema = new Mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    genero: { type: String },
    reparto: [{ type: Schema.ObjectId, ref: "Actor" }],
    director: { type: Schema.ObjectId, ref: "Director" },
    serie: { type: Schema.ObjectId, ref: "Serie" },
    temporada: {type: Number, required: true},
    estreno: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Episodio', EpisodioSchema);