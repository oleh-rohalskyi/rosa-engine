const rosaPug = require("./rosa-pug");
const pug = require("pug");

const payLoad = (page,config) => {
  
  return {
    sys: {
      env: process.env.NODE_ENV,
      scripts: [],
      loco: page.pathnames.current,
      code: 200,
      error: "",
      errorMessage: "",
      template: page.template
    },
    user: page.user ? page.user : {role: "guest"},
    alias: "page_"+page.template.replace("/","_"),
    meta: {
      title: "",
      discription: "",
      robots: "noindex"
    },
    lang: (page.lang === "common" ) ? config.langs.common : page.lang,
    title: "",
    data: {
      ...page.data
    }
}};

const render = {
  async prerenderPage(page) {
    return new Promise((res,rej)=>{
      const fileLink = `./views/pages/${page.template}.pug`;
      template.addLayOut(fileLink).then((rendered)=>{
        res(pug.render(rendered,{
          basedir: __dirname+"/rosa"
        }));
      });
    });
  },
  go(response,options) {
    console.log("GO");
    // console.log(fileLink);
    console.log(options);
    const fileLink = `./views/pages/${options.page.template}.pug`;
    rosaPug.addLayOut(fileLink).then((rendered)=>{
      
      const renderedFunction = pug.compile(rendered,{
        basedir: __dirname+"/rosa"
      });
    
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8;"
      });

      response.write(renderedFunction(payLoad(options.page,options.config)))

      response.end();

    })
  },
  goError(code, response, options) {
    // console.log(response);
    const errorTemplate = process.env.NODE_ENV === 'dev' ? "system/server-error" : "views/pages/trouble";

    const map = {
      404: {
        code: 404,
        errorMessage: options.errorMessage,
        template: "views/pages/404"
      },
      415: {
        code: 415,
        errorMessage: "Unsupported Media Type",
        template: errorTemplate,
      },
      600: {
        code: process.env.NODE_ENV === 'dev' ? 500 : 400,
        errorMessage: options.errorMessage,
        template: errorTemplate
      }
    };
    
      const page = {};

      page.template = map[code].template;
      
      page.pathnames = {
        current: options.pathname
      }
      
      page.lang = options.lang;
      
      const data = payLoad(page,options.config);

      data.sys = {
        ...data.sys,
        code,
        error: true,
        errorMessage: options.errorMessage,
      }
      

      rosaPug.addLayOut(`${page.template}.pug`)
        .then((rendered)=>{
          console.log(data,rendered)
          return pug.render(rendered,{
            basedir: __dirname+"/rosa"
          });
        
        })
        .then((renderedFunction)=>{
          let html = ""
          try  {
            console.log(data);
            html = renderedFunction(data);
          } catch (error) {

              response.writeHead(200, {
                "Content-Type": "application/json"
              });

              response.write( JSON.stringify(error) );
              response.end();

              return;
          }
          response.writeHead(code, {
                "Content-Type": "text/html; charset=UTF-8"  
          });
          response.write( data );
          response.end();
        })
  }
} 
module.exports = render;