var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var system = new Schema({
    date: Date,
    issues: Array
});

module.exports = mongoose.model('issues', system);