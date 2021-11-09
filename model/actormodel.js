const Mongoose = require("mongoose");

const ActorSchema = new Mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = Mongoose.model('Actor', ActorSchema);