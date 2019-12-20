const path = require("path");
const fs = require("fs");
const render = require("./render");

module.exports = (pathname,response,pages) => {
    return new Promise((res,rej)=>{
        let shared = pathname.split("/")[1] === "shared" ? pathname=pathname.replace("shared","shared_js"):false;
        let danger_one = pathname.split("..").length;

        pathname = "."+pathname;
        
        const ext = path.parse(pathname).ext;
        //#TODO multipy request;
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
        
        const contentType = map[ext];

        switch (contentType) {
            case "text/css":
            case "text/javascript":
                break;
        
            default:
                break;
        }

        console.log(pathname)
        fs.exists(pathname, function (exist) {
            if(!exist) {
                render.goError(404, response,{
                    errorMessage: path.parse(pathname).base + " not found",
                    pages
                  });
                return;
            }

            if ((!map[ext] || shared) && !danger_one) {
                render.goError(415, response, {
                    errorMessage: path.parse(pathname).base + " not found"
                });
                return;
            }
            fs.readFile(pathname, function(err, data){
                if(err){
                 console.log(errpr)
                  render.responseError(500,response,{
                    errorMessage: path.parse(pathname).base + " not found"
                  });
                } else {
                    res({data,ext:map[ext]});
                }
            });
        });
    });
    
}