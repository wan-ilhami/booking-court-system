var mongoose = require('mongoose');
var Schema = mongoose.Schema;

bookSchema = new Schema( {
	
	bookingid: Number,
    userid: String,

	bookdate: String,
    court: Number,
    booktime: String,
        
}),
Booking = mongoose.model('Booking', bookSchema);

module.exports = Booking;