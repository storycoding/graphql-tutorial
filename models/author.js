const mongoose = require('mongoose');

const { Schema } = mongoose;

const Model = mongoose.model.bind(mongoose);
// must bind the context of this
// to avoid cannot read property 'modelSchemas' bug

const authorSchema = new Schema({
	name: String,
	age: Number
});

module.exports = Model('Author', authorSchema);