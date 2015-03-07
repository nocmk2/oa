var Engproj = require('../models/engproj');

var engprojService = {};

engprojService.getAll = function(callback){
    var engprojs = Engproj.find({});
    engprojs.exec(callback);
};

module.exports = engprojService;