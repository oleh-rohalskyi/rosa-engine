console.clear();

const http = require("http");
const cors = require("./system/cors")
const pager = require("./system/pager");
const db = require("./system/db");
const render = require("./system/render");
const getStaticText = require("./system/get-static-text");
const url = require('url');
const querystring = require('querystring');
const config = require('./system/data.json');
const session = require('./system/session');

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
const actions = [
  "signup",
  "signin",
  "logout"
];

module.exports = function start(pages,port) {
  return new Promise((res,rej)=>{
    let server = http.createServer(async function(request, response){
      const user = {
        role: "guest"
      }
      const role = db.jwtget(
        session.filter(i=>i===parseCookies(request).authentication)[0]
      );
      const jwtData = role.split("-=number=-");
      user.role = jwtData[0];
      user.id = jwtData[1] || NaN;
      user.registered = user.role !== "guest";
      const parsedUrl = url.parse(request.url);
      let pathname = `${parsedUrl.pathname}`;
    
      console.log("Request =================>"+pathname);
    
      const sURL = request.url.split("/")
    
      let path1level = sURL[1];
      let path2level = sURL[2];
      let path3level = sURL[3];
      
      const options = {
        pathname
      }
    
      if (path1level === "rosa-api") {
    
        if(path2level === "auth") {
    
          let body = [];
         
          request.on('data', (chunk) => {
            body.push(chunk);
          }).on('end', () => {
            
            body = Buffer.concat(body).toString();
            body = querystring.parse(body);
    
            const action = path3level;
            
            if (actions.indexOf(action) >= 0) {
              
              db[action](body).then(
                function(result){

                  response.writeHead(200, {
                      "Content-Type": "application/json; charset=utf-8;"
                  });

                  response.write(JSON.stringify(result));

                  response.end();

                },
                function(result) {
                  response.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8;"
                });

                response.write(JSON.stringify(result));

                response.end();
                });
    
            }
    
          });
    
          return;
    
        }

      }
      if (path1level === "cdn") {
    
          cors(response);
          // if pathname.match("/cdn/system")
          getStaticText(pathname.replace("/cdn",""),response).then((result)=>{
            response.setHeader( 'Content-type', result.ext || 'text/plain' );
            response.end(result.data);
          });
    
          return;
      }

      const { langs } = config;
      const widgets = await db.getWidgets();
      console.log("widgets",widgets);
      options.lang = langs.scope.filter(  str => path1level === str  )[0] || langs.common;
      pathname = pathname.replace(options.lang+"/", "");
      let page = pager.findPageByPathname(pages, pathname, options.lang);
    
      if (page) {
        
        if (page.redirect) 
          page = pager.findRedirectPage(
            pages,
            page.to,
            options.lang
          );
        if (page) { try {          
            //check what user role needed for a page or if it needed at all;
            if ( page.roles && page.roles.indexOf(user.role) >= 0 ) {
              render.go(response, {options,user,page,widgets});
            } else if (!page.roles) {
              render.go(response, {options,user,page,widgets});
            } else {
              render.goError(500,response,{
                errorMessage: "no access ",
                options,
                pages
              });
            }
          
          } catch(e) {
            console.log("AHTUNG",e);
            render.goError(500,response,{
              errorMessage: e,
              options,
              pages
            });
    
          }} else {
          render.goError(404,response,{
            errorMessage: decodeURI(request.url) + " not found",
            options,  
            pages
          });
    
        }
    
      } else {
    
        render.goError(404,response,{
          errorMessage: decodeURI(request.url) + " not found",
          options,
          pages,
        });
    
      }

    })
  
    server.listen(port,()=>{
      res(server);
    });

  });
}





