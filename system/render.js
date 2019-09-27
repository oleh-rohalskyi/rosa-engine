const conf = require("./conf");
const parseError = require('parse-error');
const pug = require('pug');

const render = {
  
  go(response, req, startTime) {

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8;"
    });

    const lang = req.lang;

    let data = {
      translations: {
        meta: {
          title: "development",
          discription: "none",
          robots: "norobots"
        }
      }
    };

    data = {
      lang,
      ...data,
      role: req.role,
      widgetsScript: req.page.widgetsScript,
      widgets: req.page.widgets, 
      reg: req.role !== "guest",
      name: req.page.name,
      dev: conf.env === "dev",
      time: startTime,
      location: req.pathname,
      pages: conf.pages,
      langRouting: conf.langRouting
    };
    
    let html = "";

    try {
      html = req.page.rf(data);
    } catch (e) {
      this.logE(e);
      this.goError(500,response,req,e)
      return;
    }
    response.end(html);
  },
  goApi(data,response) {
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8;"
    });
    response.end( JSON.stringify(data) );
  },
  goApiError(code, response, req,e) {
    response.writeHead(code, {
      "Content-Type": "application/json; charset=utf-8;"
    });
    data = this.logE(e);
    data.errorLink = "vscode://file"+data.filename+":"+data.line;
    data.errorLinkHtml = `<a href="${data.errorLink}">${data.filename} on line <b>${data.line}</b></a>`;
    response.end(JSON.stringify({success:false,error:data.type?data:{
      message:e,
    }}));
  },
   logE(e) {
     if (typeof e === "string") {
       return {message: e}
     }
     data = parseError(e);
     if (e.path) {
       data.filename = e.path;
     }
    if (!data.type) {
      conf.log("r","error",["b",JSON.stringify(e)])
      return;
    }
    e = data;
    let subTitlesConf = [];
    for (const key in e) {
      if (e.hasOwnProperty(key)) {
        const element = e[key];
        
        if (key === "stack") {
          subTitlesConf.push("m");
          subTitlesConf.push( key + ":" + element );
        }
        else {
          subTitlesConf.push("b");
          subTitlesConf.push( key + ":" + element );
        }
      }
    }
    conf.log("r","error",subTitlesConf);
    return data;
  },
  goError(code, response, req,e) {
    let data = {
      translations: {
        meta: {
          title: 500,
          discription: "none",
          robots: "norobots"
        }
      }
    };
    data.translations.title = code;
    let e404 = {};
    let html = "";

    for (const key in req.pages) {
      if (req.pages.hasOwnProperty(key)) {
        const page = req.pages[key];
        if (page.name === "404")
          e404 = page;
      }
    }
    
    response.writeHead(code, {
      "Content-Type": "text/html; charset=utf-8;"
    });
    
    try {
      if (code === "404") {
        html = e404.rf(meta);
      } else {
        data = this.logE(e);
        if (e.path) {
          data.filename = e.path;
        }
        html = pug.compileFile('./system/error.pug')(  { ...(data.type?data:{message:e}),errorPage:true } );
      }
    } catch(e) {
      data = this.logE(e);
      if (e.path) {
        data.filename = e.path;
      }
      html = pug.compileFile('./system/error.pug')( { ...(data.type?data:{message:e}),errorPage:true } );
    }

    response.end(html);

  }
}
module.exports = render;