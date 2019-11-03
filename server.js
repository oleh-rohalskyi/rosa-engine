

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
    if (key === "api") {
      continue;
    }
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

      if (request.method === "GET") {
        req.params = parsedUrl.query;
      } else {
        console.log(request.headers);
        req.params = await api.readBody(request);
        if (request.headers["content-type"]==="application/json") {
          for (const key in req.params) {
              req.params = JSON.parse(key);
          }
        }
        console.log(3,req.params)
      }
      
      req.lang = "no needed";
      let path1level = pathname.split("/")[1];
      conf.langRouting = langs.route_type;
      if (conf.langRouting === "pre_path") {
        const type = pathname.split("/")[1];
        if (langs.scope.indexOf(type)>=0) {
          path1level = "page";
          req.lang = langs.scope.filter(str => type === str)[0] || langs.common;
          pathname = pathname.replace(req.lang + "/", ""); 
        }
      } else {
        path1level = pathname.split("/")[0];
        req.lang = langs.scope.filter(str => req.params.lang === str)[0] || langs.common;
      }
      req.pages = pages;
      req.role = conf.role || "guest";
      req.pathname = pathname;
      req.fullRequest = request;
      
      conf.log("c","request", ["b","path: "+req.pathname,"b","role: "+req.role,"b","lang: "+req.lang]);
      
      if (path1level === "api") {

        api.go(req)
          .then((data)=>{
            render.goApi(data,response)
          })
          .catch((e)=>{
            render.goApiError(500,response, req,e)
          });
        
        return;

      } else if (path1level === "cdn") {

        getStaticText(pathname.replace("/cdn", ""), response, pages).then((result) => {
          response.setHeader('Content-type', result.ext || 'text/plain');
          response.end(result.data);
        });

        return;

      } else if (path1level === "page") {

        let page = pages[pathname];
        
        if (page && !!page.redirect) {
          req.redirect = !!page.redirect;
          page = pages[page.to];
        }

        if (page) {
            conf.log("g","page '"+ page.name+"' founded",["b","redirect "+!!page.redirect]);
            req.page = page;
           
              //check what user role needed for a page or if it needed at all;
              if (page.roles && page.roles.indexOf(req.role) >= 0) {
                render.go(response, req, startTime);
                return;
              } else if (!page.roles || page.roles.indexOf("guest") >= 0) {
                render.go(response, req, startTime);
              } else {
                render.goError(503,response,req,"no access");
              }
         
        } else {
          render.goError(404,response, req, "page " + req.pathname + " not found");
        }
        return;
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







