const path = require("path");
const fs = require("fs");

module.exports = (pathname,response) => {
    return new Promise((res,rej)=>{

        const ext = path.parse(pathname).ext;

        const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
        };

        fs.exists(pathname, function (exist) {
            if(!exist) {
                render.responseError(600, response, path.parse(pathname).base + " not found",parsedUrl.pathname);
                return;
            }

            if (!map[ext]) {
                render.responseError(415, response, null ,parsedUrl.pathname);
                return;
            }

            fs.readFile(pathname, function(err, data){
                if(err){
                render.responseError(600,response,err,parsedUrl.pathname);
                } else {
                    res(data,map[ext]);
                }
            });
        });
    });
    
}