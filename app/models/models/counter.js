var mongoose = require('mongoose');
var CounterSchema = require('../schemas/counter');


//添加获取递增序列号方法
CounterSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

var Counter = mongoose.model('Counter',CounterSchema);

module.exports = Counter;