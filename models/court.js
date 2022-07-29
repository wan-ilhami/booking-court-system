var mongoose = require('mongoose');
var Schema = mongoose.Schema;

courtSchema = new Schema( {
	
	courtid: Number,
    courtname: String,
	status: String
	
}),
Court = mongoose.model('Court', courtSchema);

module.exports = Court;