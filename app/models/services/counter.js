var Counter = require('../models/counter');

var counterService = {};

//获取递增顺序号
counterService.getSeqID = function(name){

    Counter.findAndModify({_id: name}, [],{ $inc: { seq: 1 } }, {new:true}, function (err,counter) {
        if (err) throw err;
        console.log('updated, counter is ' + counter.seq);
});

   // engprojs.exec(callback);
   // return aaa;
};


module.exports = counterService;