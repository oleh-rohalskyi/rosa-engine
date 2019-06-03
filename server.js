console.clear();
console.log("Start ========================================");

const http = require("http");
const data = require("./data");
const cors = require("./system/cors")
const pager = require("./system/pager");
const db = require("./system/db");
const render = require("./system/compile");
const apiRenderer = require("./system/api-renderer");
const getStaticText = require("./system/get-static-text");
const url = require('url');
const querystring = require('querystring');

const config = {
  langs: {
    common: "eo",
    scope: ["eo","uk"]
  }
}

const actions = [
  "signup",
  "signin",
  "logout"
]
pager.fillCash(data.pages).then(

  pages=>{

    http.createServer(function(request, response){

      const parsedUrl = url.parse(request.url);
      const pathname = `.${parsedUrl.pathname}`;

      console.log("Request =================>"+pathname);

      const sURL = request.url.split("/")

      let path1level = sURL[1];
      let path2level = sURL[2];
      let path3level = sURL[3];
      
      const options = {
        pathname,
        page: {},
        config,
        lang: config.langs.common
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
      if (path1level === "static") {

          cors(response);

          getStaticText(pathname,render).then((data,ext)=>{
            response.setHeader('Content-type', ext || 'text/plain' );
            response.end(data);
          })

          return;
      }
    
      options.lang = config.langs.scope.filter(  str => path1level === str  )[0] || "common";

      options.page = pager.findPageByPathname(pages, pathname, options.lang);

      if (options.page) {
        
        options.page.lang = options.lang;

        if (options.page.redirect) 
          options.page = pager.findRedirectPage(
            pages,
            options.page.to[options.page.lang]
          );
        if (options.page) { try {

            options.page.lang = options.lang;

            options.page.user = {
              role: "guest"
            }

            options.page.data = {
              fragments: {
                "header": {

                },
                "auth": {
                  signin: {
                    login: {
                      "label": "login",
                      "less-then-4": "login mast be more than 6 simbols",
                      "is-empty": "login can\'t be empty"
                    },
                    pass: {
                      "less-then-4": "pass mast be more than 6 simbols",
                      "is-empty": "pass can\'t be empty"
                    },
                    errors: {
                      "ER_DUP_ENTRY": "user already exist",
                      "ECONNREFUSED": "limit done"
                    }
                  },
                  signup: {
                    login: {
                      "less-then-4": "login mast be more than 6 simbols",
                      "is-empty": "login can\'t be empty"
                    },
                    pass: {
                      "less-then-4": "pass mast be more than 6 simbols",
                      "is-empty": "pass can\'t be empty"
                    },
                    errors: {
                      "ER_DUP_ENTRY": "user already exist",
                      "ECONNREFUSED": "limit done"
                    }
                  }
                }
              }
            }
            //check what user role needed for a page or if it needed at all;
            if ( options.page.roles && options.page.roles.indexOf(options.page.user.role) >= 0 ) {
              render.compilePage(response, options);
            } else if (!options.page.user.roles) {
              render.compilePage(response, options);
            } else {
              render.responseError(600,response,{
                errorMessage: "no access ",
                ...options
              });
            }
          
            
    
          } catch(e) {
    
            render.responseError(600,response,{
              errorMessage: e,
              ...options
            });
    
          }} else {

          render.responseError(404,response,{
            errorMessage: decodeURI(request.url) + " not found",
            ...options}
          );
    
        }
    
      } else {

        render.responseError(404,response,{
          errorMessage: decodeURI(request.url) + " not found",
          ...options
        });
    
      }
    }).listen(3000);
  }
)

