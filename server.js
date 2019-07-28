console.clear();

const http = require("http");

const cors = require("./system/cors")
const pager = require("./system/pager");
const rosaPug = require("./system/rosa-pug");
const db = require("./system/db");
const render = require("./system/render");
const apiRenderer = require("./system/api-renderer");
const getStaticText = require("./system/get-static-text");
const url = require('url');
const querystring = require('querystring');

const actions = [
  "signup",
  "signin",
  "logout"
];

const port = 3000;

module.exports =  function proccess(callback) {
  return new Promise((res)=>{

  
  rosaPug.start().then(pages => {
    
      let server = http.createServer(async function(request, response){
       
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
                    apiRenderer[action](response,result);
                  },
                  function(err) {
                    apiRenderer.error(response,err);
                  }
                )
  
              }
  
            });
  
            return;
  
          }
        }
        if (path1level === "cdn") {
  
            cors(response);
  
            getStaticText(pathname.replace("/cdn",""),response).then((data,ext)=>{
              response.setHeader('Content-type', ext || 'text/plain' );
              response.end(data);
            })
  
            return;
        }
        const { langs,fragments } = await db.getConfig();
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
  
              const user = {
                role: "guest"
              }
              
              //check what user role needed for a page or if it needed at all;
              if ( page.roles && page.roles.indexOf(user.role) >= 0 ) {
                render.go(response, {options,user,page,fragments});
              } else if (!page.roles) {
                render.go(response, {options,user,page,fragments});
              } else {
                render.goError(500,response,{
                  errorMessage: "no access ",
                  options
                });
              }
            
            } catch(e) {
              
              render.goError(500,response,{
                errorMessage: e,
                options
              });
      
            }} else {
  
            render.goError(404,response,{
              errorMessage: decodeURI(request.url) + " not found",
              options
            });
      
          }
      
        } else {
  
          render.goError(404,response,{
            errorMessage: decodeURI(request.url) + " not found",
            options
          });
      
        }
      })

      server.listen(port,()=>{
        console.log("server listen on port %s", port)
        callback(server);
      });
      

    });
  });
}



