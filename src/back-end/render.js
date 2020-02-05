const conf = require("../../conf/app.config");
const pug = require('pug');
const api = require("./../../api");

const render = {
  
  async go(response, req, startTime) {

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8;"
    });

    const lang = req.lang;

    const fp = (name) => {
      console.log("fp",name,conf.pages)
      let ids = [];
      for (const key in conf.pages) {
        if (conf.pages.hasOwnProperty(key) && conf.pages[key].name === name) {
          ids.push(conf.pages[key].id)
        }
      }
      return ids;
    }

    api.translations.full.get(req.page.widgets,lang,fp(req.page.name)).then((result)=>{
      let tr = {};
        
        let wn = (id,table) => {
          if (table === "pages") {
            for (const key in conf.pages) {
              if (conf.pages.hasOwnProperty(key) && conf.pages[key].id === id) {
                return conf.pages[key].name
              }
            }
          } else if (conf[table]) {
            return conf[table].filter((i)=>i.id === id*1)[0].name;
          }
        }

        try {
          result.forEach(element => {
            if (!tr[element.table_name])
              tr[element.table_name] = {};
            tr[element.table_name][wn(element.row_id,element.table_name)] = JSON.parse(element[lang]);
          });
        } catch (error) {
          console.log(50,error)
        }
        
      tr.page = tr.pages ? tr.pages[req.page.pageName] : {meta:{}};
      console.log(conf)
      let data = {
        lang,
        isAuth: conf.authConf.active,
        auth: JSON.stringify(conf.auth),
        pageName: req.page.pageName,
        tr,
        role: req.role,
        widgetsScript: req.page.widgetsScript,
        widgets: req.page.widgets,
        allWidgets: conf.widgets,
        reg: req.role !== "guest",
        name: req.page.name,
        script: req.page.script,
        dev: conf.env === "dev",
        time: startTime,
        location: req.pathname,
        pages: conf.pages,
        langs: conf.langs,
        langRouting: conf.langRouting
      };
        console.log("go",data);
      let html = "";

      try {
        html = req.page.rf(data);
      } catch (e) {
        console.log(e);
        this.goError(500,response,req,e)
        return;
      }

      response.end(html);
    }).catch(e=>{
      console.log(e);
    });
   
    
    
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
    
    response.end(JSON.stringify({success:false,error:e}));
    
    
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
        if ( e && e.path) {
          data.filename = e.path;
        }
        console.log(e);
        html = pug.compileFile('./system/error.pug')(  { message:e,errorPage:true } );
      }
    } catch(e) {
      console.log(e);
      if (e.path) {
        data.filename = e.path;
      }
      html = pug.compileFile('./system/error.pug')( { message:e,errorPage:true } );
    }

    response.end(html);

  }
}
module.exports = render;