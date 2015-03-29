var fs = require('fs');
var path = require('path');
var multer  = require('multer');

module.exports = function(app){

    app.use(multer({ dest: (path.join(__dirname,"../public/")),

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

            if(req.originalUrl === '/profile/uploadPortrait'){
                var ext = path.extname(file.originalname);
                ext = ext.toLowerCase();

                //检查文件格式,若格式不正确，则删除文件，取消上传。若为正确格式的文件，同一转换成png格式。
                if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
                    if(fs.existsSync(path.join(__dirname,"../public/images/portrait/",file.name))){
                        fs.unlinkSync(path.join(__dirname,"../public/images/portrait/",file.name));
                    }
                }else{
                    var oldPath = path.join(__dirname,"../public/images/portrait/",file.name);

                    //等待文件全部上传
                    while(!fs.existsSync(oldPath)){

                    }

                    var newFileName = path.basename(file.name,ext) + '.png';
                    var newPath = path.join(__dirname,"../public/images/portrait/",newFileName);
                    fs.renameSync(oldPath,newPath);

                }

            }
        }}));
};
