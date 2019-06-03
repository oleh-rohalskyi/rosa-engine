const pug = require('pug');

const payLoad = (page,config) => {
  console.log(2223,page)
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

const compile = {
  addLayOut(fileLink) {
    let compiled = "";
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileLink)
    });
    return new Promise((res)=>{
      lineReader.on('line', (line) => {
        compiled = compiled+"  "+line+"\n"
      });
      lineReader.on('close', ()=>{
        res("extends /../../system/views/layout.pug\nblock content\n"+compiled);
      })
    });
  },
  precompilePage(page) {
    return new Promise((res,rej)=>{
      const fileLink = `./views/pages/${page.template}.pug`;
      compile.addLayOut(fileLink).then((compiled)=>{
        res(pug.compile(compiled,{
          basedir: __dirname+"/rosa"
        }));
      });
    });
  },
  compilePage(response,options) {
    
    const fileLink = `./views/pages/${options.page.template}.pug`;
    
    compile.addLayOut(fileLink).then((compiled)=>{
      const compiledFunction = pug.compile(compiled,{
        basedir: __dirname+"/rosa"
      });
    
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8;"
      });
      console.log(payLoad(options.page,options.config));
      response.write(compiledFunction(payLoad(options.page,options.config)))

      response.end();

    })
  },
  responseError(code, response, options) {
      console.log(code)
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
      console.log(222,data);

      compile.addLayOut(`${page.template}.pug`).then((compiled)=>{

        const compiledFunction = pug.compile(compiled,{
          basedir: __dirname+"/rosa"
        });

        response.writeHead(code, {
          "Content-Type": "text/html; charset=UTF-8"
        });
        // console.log(111,data);
        response.write( compiledFunction(data) );
        response.end();
      })
  }
} 
module.exports = compile;