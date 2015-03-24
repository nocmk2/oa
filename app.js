var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var multer  = require('multer');
var fs = require('fs');

//路由
var authRoutes = require('./app/controllers/auth');
var profileRoutes = require('./app/controllers/profile');
var userRoutes = require('./app/controllers/user');
var engprojRoutes = require('./app/controllers/engproj');
var netprojRoutes = require('./app/controllers/netproj');
var citygovprojRoutes = require('./app/controllers/citygovproj');

var app = express();

//链接mongodb
mongoose.connect(('mongodb://' + settings.host + ':27017/' + settings.db),{
    user:"blogAdmin",
    pass:"blogAdmin",
    auth:{
        user:"dbAdmin",
        pass:"dbAdmin"
    }
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());

//文件上传配置
app.use(multer({ dest: './public',
                rename: function (fieldname) {
                            return fieldname;
                        },
                changeDest: function(dest, req, res) {
                            if(req.originalUrl === '/profile/uploadPortrait'){
                                return dest + '/images/portrait'
                            }else{
                                return dest;
                            }
                        },
                onFileUploadData: function (file, data, req, res) {

                            console.log('in on file up load data');
                            console.log(file.originalname);

                            if(req.originalUrl === '/profile/uploadPortrait'){
                                var ext = path.extname(file.originalname);
                                ext = ext.toLowerCase();

                                console.log('ext: ' + ext);

                                //检查文件格式,若格式不正确，则删除文件，取消上传。若为正确格式的文件，同一转换成png格式。
                                if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
                                    if(fs.existsSync(path.join(__dirname,"public/images/portrait/",file.name))){
                                        fs.unlinkSync(path.join(__dirname,"public/images/portrait/",file.name));
                                    }
                                }else{
                                    var oldPath = path.join(__dirname,"public/images/portrait/",file.name);

                                    //等待文件全部上传
                                    while(!fs.existsSync(oldPath)){

                                    }

                                    var newFileName = path.basename(file.name,ext) + '.png';
                                    var newPath = path.join(__dirname,"public/images/portrait/",newFileName);
                                    fs.renameSync(oldPath,newPath);

                                }

                            }

                        }}));

app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//使用路由
authRoutes(app);
userRoutes(app);
engprojRoutes(app);
netprojRoutes(app);
citygovprojRoutes(app);
profileRoutes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
