var redis = require("redis");
var session = redis.createClient();

session.on("error", function (err) {
    console.log("Error " + err);
});

const http = require("http");
const pager = require("./system/pager");
const db = require("./system/db");
const render = require("./system/render");
const getStaticText = require("./system/get-static-text");
const url = require('url');
const config = require('./configuration');
  
module.exports = function startServer(pages, widgets, port, api) {

  return new Promise( res => {
    let server = http.createServer(async function (request, response) {
      let startTime = Date.now();
      let user = {
        role: "guest",
        id: 0,
      }
      let options = {};
      let hash = parseCookies(request).authentication;
      if (hash) {
        const id = user.id;
        user = db.jwtParse(hash);
        session.set(id, user, hash, redis.print);
        session.keys((key)=>{
          console.log(key);
        })
      }

      if (config.role) {
        user.role = config.role;
      }

      user.registered = user.role !== "guest";
      const parsedUrl = url.parse(request.url);
      let pathname = parsedUrl.pathname;
      
      console.log("Request =================>" + pathname);

      const sURL = request.url.split("/")

      let path1level = sURL[1];
      let path2level = sURL[2];
      let path3level = sURL[3];

      const { langs } = config;
      options.lang = langs.scope.filter(str => path1level === str)[0] || langs.common;
      
      pathname = pathname.replace(options.lang + "/", "");

      options.role = config.user.role;
      options.pathname = pathname;
      console.log(options)
      let accessMessage = false;

      if( !( accessMessage = access(path1level,path2level,path3level) ) ) {

        if (accessMessage !== "sendet")
          render.goError(503, response, {
            errorMessage: "no access",
            options,
            pages
          });

      } else if (path1level === "api") {

        api.go(path2level,path3level,request).then(result=>{
          response.setHeader('Content-type','application/json');
          response.end(JSON.stringify(result));
        }).catch(console.log);
        
        return;

      } else if (path1level === "cdn") {

        getStaticText(pathname.replace("/cdn", ""), response, pages).then((result) => {
          response.setHeader('Content-type', result.ext || 'text/plain');
          response.end(result.data);
        });

        return;

      } else {
        let page = pager.findPageByPathname(pages, options.pathname, options.lang);
        if (page) {
          if (page.redirect)
            page = pager.findRedirectPage(
              pages,
              page.to,
              options.lang
            );
          if (page) {
            try {
              //check what user role needed for a page or if it needed at all;
              if (page.roles && page.roles.indexOf(user.role) >= 0) {
                render.go(response, { options, user, page, widgets },startTime);
                return;
              } else if (!page.roles || page.roles.indexOf("guest") >= 0) {
                render.go(response, { options, user, page, widgets },startTime);
              } else {
                render.goError(500, response, {
                  errorMessage: "no access ",
                  options,
                  pages
                });
              }
            } catch (e) {
              render.goError(500, response, {
                errorMessage: e,
                options,
                pages
              });
            }
          } else {
            render.goError(404, response, {
              errorMessage: decodeURI(request.url) + " not found",
              options,
              pages
            });
          }
        } else {
          render.goError(404, response, {
            errorMessage: decodeURI(request.url) + " not found",
            options,
            pages,
          });
        }
        return;
      }
      
      function access(path1level,path2level,path3level) {
        function goError() {
          render.goError(503, response, {
            errorMessage: "no access",
            options,
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

    server.listen(port, () => {
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







