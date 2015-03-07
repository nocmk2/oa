var mongodb = require('./db');
var objectId = require('mongodb').ObjectID;

function Engproj(engproj) {
    this.transid = engproj.transid; //传输编号
    this.controlid = engproj.controlid; //受控编号
    this.projname = engproj.projname; //工程名称
}

module.exports = Engproj;

//存储一个工程公司项目及其相关信息
Engproj.prototype.save = function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    //要存入数据库的文档
    var engproj = {
        transid: this.transid,  //传输编号
        controlid: this.controlid,  //受控编号
        projname: this.projname,   //工程名称
        time: time
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if (result === true) {
                //读取 engprojs 集合
                db.collection('engprojs', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    //将工程公司项目插入 engprojs 集合
                    collection.insert(engproj, {
                        safe: true
                    }, function (err,engproj) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null,engproj[0]);//返回 err 为 null
                    });
                });
            }
        });
    });
};

//读取工程公司项目及其相关信息
Engproj.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if (result === true) {
                //读取 engprojs 集合
                db.collection('engprojs', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    var query = {};
                    if (name) {
                        query.name = name;
                    }
                    //根据 query 对象查询文章
                    collection.find(query).sort({
                        time: -1
                    }).toArray(function (err, docs) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null, docs);//成功！以数组形式返回查询的结果
                    });
                });
            }
        });
    });
};

//读取所有engprojs信息列表
Engproj.getall = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('engprojs', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    var query = {};
                    if (name) {
                        query.name = name;
                    }
                    //根据 query 对象查询文章
                    collection.find(query).sort({
                        name: -1
                    }).toArray(function (err, docs) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null, docs);//成功！以数组形式返回查询的结果
                    });
                });
            }
        });
    });
};