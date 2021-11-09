const Mongoose = require("mongoose");

const DirectorSchema = new Mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = Mongoose.model('Director', DirectorSchema);