const rosaPug = require("./rosa-pug");
const pug = require("pug");

const render = {
  go(response,{options,page,user,fragments}) {
   
    const fileLink = `./components/pages/${page.template}.pug`;
    // console.log(page);
    
    rosaPug.addLayOut(fileLink).then((rendered)=>{
      
      
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8;"
      });
      const fragmentsForThisPage = page.rf.dependencies
        .map(i=>i.split("/fragments/")[1])
          .filter(i=>!!i);
      const fr = {};
      console.log(fragmentsForThisPage)
      fragmentsForThisPage.forEach(element => {

        const frName = element.split(".pug")[0];
        if (fragments[frName].translations) {
          console.log("fragment",fragments[frName].translations,options.lang)
          const values = fragments[frName].translations[options.lang];
          console.log("values---?",values)
          for (const key in values) {

              const value = values[key];

              if (!fr[frName])
                fr[frName] = {}
              
              fr[frName][key] = value;

          }
        }
        
        
      });
      // console.log(page.data,options.lang)
      console.log("fr",fr);
      if (page.data) {
        const data  = page.data[options.lang];
        page.values = data;
        delete page.data;
      }
      // const scripts = ["auth.js"];
      // console.log(data)
      console.log(page);
      response.write(page.rf({options,page,user,fragments:fr}))

      response.end();

    })
  },
  goError(code, response, params) {
    // console.log(response);
   
    const map = {
      404: {
        code: 404,
        errorMessage: JSON.stringify(params.errorMessage),
      },
      415: {
        code: 415,
        errorMessage: "Unsupported Media Type",
      },
      500: {
        code: process.env.NODE_ENV === 'dev' ? 500 : 403,
        errorMessage: JSON.stringify(params.errorMessage),
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