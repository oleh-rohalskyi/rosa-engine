const rosaPug = require("./rosa-pug");
const pug = require("pug");

const render = {
  go(response,{options,page,user,fragments}) {
   
    const fileLink = `./views/pages/${page.template}.pug`;
    // console.log(page);
    
    rosaPug.addLayOut(fileLink).then((rendered)=>{
      
      
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8;"
      });
      const fragmentsForThisPage = page.rf.dependencies
        .map(i=>i.split("/fragments/")[1])
          .filter(i=>!!i);
      const fr = {};
      // console.log(fragments)
      fragmentsForThisPage.forEach(element => {

        const frName = element.split(".pug")[0];

        const values = fragments[frName];

        for (const key in values) {

            const value = values[key];

            if (!fr[frName])
              fr[frName] = {}
            
            fr[frName][key] = value[options.lang];

        }
        
      });
      // console.log(page.data,options.lang)
      if (page.data) {
        const data  = page.data[options.lang];
        page.values = data;
        delete page.data;
      }
      // const scripts = ["auth.js"];
      // console.log(data)
      console.log(page);
      response.write(page.rf({options,page,user,fr}))

      response.end();

    })
  },
  goError(code, response, params) {
    // console.log(response);
    const errorTemplate = process.env.NODE_ENV === 'dev' ? "system/server-error" : "views/pages/trouble";
    console.log(params);
    const map = {
      404: {
        code: 404,
        errorMessage: JSON.stringify(params.errorMessage),
        template: "views/pages/404"
      },
      415: {
        code: 415,
        errorMessage: "Unsupported Media Type",
        template: errorTemplate,
      },
      500: {
        code: process.env.NODE_ENV === 'dev' ? 500 : 403,
        errorMessage: JSON.stringify(params.errorMessage),
        template: errorTemplate
      }
    };

      const payload = map[code];
      
      response.writeHead(500, {
        "Content-Type": "text/html; charset=utf-8;"
      });

      response.write("<h1>"+payload.code+"</h1><span>"+JSON.stringify(payload)+"</span>");

      response.end();
      
  }
} 
module.exports = render;