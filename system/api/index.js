const url = require('url');
const config = require('../config');
const querystring = require('querystring');

let obj = {
    calls: {
        "pages-get": require("./pages-get"),
        "widgets-get": require("./widgets-get"),
        "signin": require("./signin"),
        "signup": require("./signup"),
        "signout": require("./signout"),
        "widgets-post": ()=>{},
        "widgets-put": ()=>{},
    },
    hook: (res,rej, payload)=>require("../hooks").request(res,rej,payload),
}

function apiController({data,role,lang,action},db) {
    return new Promise(async (res,rej) => {
        
        if (obj.calls[action]) {

            let isProtected =false;

            config.api[action].access.indexOf(role)>=0;

            if (
                config.api[action]
            ) {
                let access = true;
                isProtected = config.api[action].access.length>0;
                if (isProtected) {
                    access = config.api[action].access.indexOf(role)>=0;
                }
                if (access)
                    {
                        db.api[action]({data,url,role:role,lang}).then(res).catch(rej);
                    } else rej({errorMessage: "no access level 2"});
                } else (rej({errorMessage: "no access level 1"}))
        } else { 
            rej({errorMessage:"no end point"})
        }

    });

}

async function readBody(request) {
        
    return new Promise((res) => {
      
      let body = "";
      request.on('data', (chunk) => {
        
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) {
          request.connection.destroy();
        }
  
        body+=chunk;
  
      }).on('end', () => {
  
        body = querystring.parse(body);
  
        res(body);
  
      });
  
    });
  
  }

function requestController(request,config,db) {
    return new Promise(async (res,rej)=>{
        
        let data = {};
        const method = request.method.toLowerCase();

        if (method === "post") {
            data = await readBody(request);
        }

        if (method === "get") {
            const url_parts = url.parse(request.url, true);
            data = url_parts.query;
        }
                
        apiController({
            method,
            data,
            role: config.role,
            action: config.action,
            lang: config.lang
        },db).then(res).catch(rej);
       
        
    })
}

obj.index = requestController;
module.exports = obj;