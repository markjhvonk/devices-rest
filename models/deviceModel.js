var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var deviceModel = new Schema({
    title:{ type: String },
    type: { type: String },
    room: { type: String },
    state: { type: String, default:"false"}
});

module.exports = mongoose.model('Device', deviceModel);