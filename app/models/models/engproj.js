var mongoose = require('mongoose');
var EngprojSchema = require('../schemas/engproj');
var Engproj = mongoose.model('Engproj',EngprojSchema);

/*
 function getNextSequence(name) {
           var ret = db.counters.findAndModify(
                  {
                    query: { _id: name },
                    update: { $inc: { seq: 1 } },
                    new: true,            upsert: true          }
           );

             return ret.seq;}

*/
 function returnvalue(v){
 	return v +2;
 }

module.exports = Engproj;