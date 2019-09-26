

const http = require("http");
const render = require("./system/render");
const Session = require("./system/session")
const getStaticText = require("./system/get-static-text");
const url = require('url');
const conf = require('./system/conf');
let errCounter = -1;

const session = new Session((err)=>{

  conf.log("r","redis error: "+(++errCounter),["b",err.errno]);
  
});

module.exports = function startServer(pages, widgets, api, langs) {
  
  let subTitlesConf = [];
  for (const key in conf) {
    if (conf.hasOwnProperty(key)) {
      const element = conf[key];
      subTitlesConf.push("b");
      subTitlesConf.push( key + ":" + JSON.stringify(element) );
    }
  }
  
  conf.log("c","cofig",subTitlesConf);

  return new Promise( res => {

    let server = http.createServer(async function (request, response) {
      
      let startTime = Date.now();

      let user = {
        role: "guest",
        id: 0,
      }
      
      let req = {};

      if (conf.role) {
        user.role = conf.role;
      }

      user.registered = user.role !== "guest";
      
      let parsedUrl = url.parse(request.url,true);
      let pathname = parsedUrl.pathname;
      const sURL = request.url.split("/")

      let path1level = sURL[1];
      let path2level = sURL[2];
      let path3level = sURL[3];

      if (request.method === "GET") {
        req.params = parsedUrl.query;
      } else {
        req.params = api.readBody(request);
      }

      if (langs.route_type === "pre_path") {
        req.lang = langs.scope.filter(str => path1level === str)[0] || langs.common;
        pathname = pathname.replace(req.lang + "/", ""); 
      } else {
        req.lang = langs.scope.filter(str => req.params.lang === str)[0] || langs.common;
      }
      
      
      req.role = conf.role || "guest";
      req.pathname = pathname;

      conf.log("c","request", ["b","path: "+req.pathname,"b","role: "+req.role,"b","lang: "+req.lang]);

      let accessMessage = false;

      if( !( accessMessage = access(path1level,path2level,path3level) ) ) {

        if (accessMessage !== "sendet") {

          render.goError(503, response, {
            errorMessage: "no access",
            req,
            pages
          });
          
        }
          

      } else if (path1level === "api") {

        api.go(path2level,path3level,request,req).then(result=>{
          response.setHeader('Content-type','application/json');
          response.end(JSON.stringify(result));
        }).catch(function(result){
          response.setHeader('Content-type','application/json');
          response.end(JSON.stringify(result));
        });
        
        return;

      } else if (path1level === "cdn") {

        getStaticText(pathname.replace("/cdn", ""), response, pages).then((result) => {
          response.setHeader('Content-type', result.ext || 'text/plain');
          response.end(result.data);
        });

        return;

      } else {

        let page = pages[pathname];
        req.redirect  = !!page.redirect;
        if (!!page.redirect) {
          page = pages[page.to];
        }
        if (page) {
            conf.log("g","page '"+ page.name+"' founded",["b","redirect "+req.redirect]);
            try {
              //check what user role needed for a page or if it needed at all;
              if (page.roles && page.roles.indexOf(user.role) >= 0) {
                render.go(response, { req, user, page, widgets },startTime);
                return;
              } else if (!page.roles || page.roles.indexOf("guest") >= 0) {
                render.go(response, { req, user, page, widgets },startTime);
              } else {
                render.goError(500, response, {
                  errorMessage: "no access ",
                  req,
                  pages
                });
              }
            } catch (e) {
              render.goError(500, response, {
                errorMessage: e,
                req,
                pages
              });
            }
        
        } else {
          render.goError(404, response, {
            errorMessage: decodeURI(request.url) + " not found",
            req,
            pages,
          });
        }
        return;
      }
      
      function access(path1level,path2level,path3level) {
        function goError() {
          render.goError(503, response, {
            errorMessage: "no access",
            req,
            pages
          });
        }

        let ext = "none";
        
        if (path2level === "static") return true;
        if (path1level === "cdn" && path2level === "pages") return true;
        if (path1level === "api") {
          return true;
        } else if (!path3level) {
          return true
        } else {
          type = path3level.split(".")[0]
          ext = path3level.split(".")[1]
        }
        if (ext) {goError();return false;}
        
      }

    })

    server.listen(conf.port, () => {
      res(server);
    });

  });
}

function parseCookies(request) {

  var list = {},
  rc = request.headers.cookie;

  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;

}







