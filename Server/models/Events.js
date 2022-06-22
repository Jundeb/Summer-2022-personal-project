const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    date: Date,
    logItem: String,
});

module.exports = mongoose.model('Event', logSchema);