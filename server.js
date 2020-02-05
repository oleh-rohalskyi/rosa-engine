const http = require("http");
const render = require("./src/back-end/render");
const getStaticText = require("./src/back-end/get-static-text");
const url = require('url');
const conf = require('./conf/app.config');
const api = require('./api/');

module.exports = function startServer(pages,widgets) {

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
        req.params = await api.readBody(request);
        if (request.headers["content-type"]==="application/json") {
          for (const key in req.params) {
              req.params = JSON.parse(key);
          }
        }
      }

      let path1level = pathname.split("/")[1];

      if (conf.langs.route_type === "pre_path") {
        const type = pathname.split("/")[1];
        if (conf.langs.scope.indexOf(type)>=0) {
          path1level = "page";
          req.lang = conf.langs.scope.filter(str => type === str)[0] || conf.langs.common;
          pathname = pathname.replace(req.lang + "/", ""); 
        }
      } else {
        path1level = pathname.split("/")[0];
        console.log(123123,langs)
        req.lang = conf.langs.scope.filter(str => req.params.lang === str)[0] || conf.langs.common;
      }
      if (!req.lang) {
        req.lang = conf.langs.common;
      }
      
      req.pathname = pathname;
      req.fullRequest = request;
      
      if (path1level === "api") {
        req.session = session;
        req.conf = conf;
        api.go(req)
          .then((data)=>{
            render.goApi(data,response)
          })
          .catch((e)=>{
            console.log(e);
            render.goApiError(500,response, req,e)
          });
        
        return;

      } else if (path1level === "cdn") {

        getStaticText(pathname.replace("/cdn", ""), response, pages).then((result) => {
          response.setHeader('Content-type', result.ext || 'text/plain');
          response.end(result.data);
        });

        return;

      } else if (path1level === "page" || req.pathname === "/") {
    
        let page = pages[pathname];
       
        if (page && !!page.redirect) {
          req.redirect = !!page.redirect;
          page = pages[page.to];
        }

        if (page) {
            req.page = page;
              //check what user role needed for a page or if it needed at all;
              if (!page.roles || !(page.roles && page.roles.length) ) {
                render.go(response, req, startTime);
              } else if (page.roles.indexOf("guest") >= 0 || (page.roles && page.roles.indexOf(req.role) >= 0) ) {
                render.go(response, req, startTime);
              } else {
                render.goError(503,response,req,"no access");
              }
         
        } else {
          render.goError(404,response, req, "page " + req.pathname + " not found");
        }
        return;
      }

    });

    server.listen(conf.port, () => {
      res(server);
    });

  });
}







