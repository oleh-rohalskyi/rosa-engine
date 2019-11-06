const conf = require("./conf");
const parseError = require('parse-error');
const pug = require('pug');
const api = require("../api")

const render = {
  
  async go(response, req, startTime) {

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8;"
    });

    const lang = req.lang;

    const fp = (name) => {
      let ids = [];
      for (const key in conf.pages) {
        if (conf.pages.hasOwnProperty(key) && conf.pages[key].name === name) {
          ids.push(conf.pages[key].id)
        }
      }
      return ids;
    }

    conf.api.translations.full.get(req.page.widgets,lang,fp(req.page.name)).then((result)=>{
      
      let tr = {};
      let wn = (id,table) => {
        console.log(id,table)
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
          console.log(element,lang)
          if (!tr[element.table_name])
            tr[element.table_name] = {};
          tr[element.table_name][wn(element.row_id,element.table_name)] = JSON.parse(element[lang]);
        });

      } catch (error) {

      }
      
      let data = {
        lang,
        isAuth: conf.authConf.active,
        auth: JSON.stringify(conf.auth),
        pageName: req.page.pageName,
        tr: tr.pages ? {
          page: tr.pages[req.page.name],
          widgets: tr.widgets
        } : {
          page: {
            meta: "",
            title: "",
            discription: "",
            robots: ""
          },
          widgets: tr.widgets
        },
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
      
      let html = "";
      console.log(222)
      try {
        html = req.page.rf(data);
        console.log(2223)
      } catch (e) {
        console.log(e);
        this.goError(500,response,req,e)
        return;
      }

      response.end(html);
    }).catch(e=>console.log);
   
    
    
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