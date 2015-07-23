var mongoose = require('mongoose');
var SelectoptionsSchema = require('../schemas/selectoptions');
var Selectoptions = mongoose.model('Selectoptions',SelectoptionsSchema);

module.exports = Selectoptions;