const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const d = new Date();
const logSchema = new Schema({
    date: String,
    logItem: String,
});

module.exports = mongoose.model('Event', logSchema);