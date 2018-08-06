const mongoose = require('mongoose');

const { Schema } = mongoose;

const Model = mongoose.model.bind(mongoose);
// must bind the context of this
// to avoid cannot read property 'modelSchemas' bug

const bookSchema = new Schema({
	title: String,
	authorId: String
});

module.exports = Model('Book', bookSchema);