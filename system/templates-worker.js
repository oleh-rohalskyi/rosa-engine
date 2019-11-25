const pug = require('pug');
const fs = require('fs');

const conf = require('./conf');
let updated = false;
const Api = require('../api');


module.exports = {
  routes: {},
  async setTmpFile(name,data) {
    return new Promise((res,rej)=>{
      fs.writeFile("./mocks/"+name+".json", JSON.stringify(data), function(err) {
        if (err) {
          rej(err);
        }
        res();
      })
    })
  },
  async start(files) {
    
    const apiConf = await Api.getConf();
    const api = new Api(apiConf);
    conf.api = api;
    
    let _pages = {};
    let _widgets = {};
    let langs = await conf.getLangs();
    conf.langs = langs;
    conf.authConf = await api.auth.getConf();
    let id_type_key = conf.authConf.id_type_key
    conf.auth = {};
    console.log(123,conf.authConf);
    switch (conf.authConf.current) {
      case "BASIC":
        conf.auth = {
          sendEmail: true,
          id_type_key: id_type_key,
          reg: {
            [id_type_key]: true,
            pass: true,
            passconfirm: true,
            captcha: true
          },
          sign: {
            [id_type_key]: true,
            pass: true
          }
        };
        break;
      case "HASH":
        conf.auth = {
          id_type_key: id_type_key,
          reg: {
            pass: true,
            captcha: true,
            hash: true
          },
          sign: {
            hash: true
          }
        };
        break;
    }

    if (conf.mock.update && !updated) {
      
      _pages = await api.engine.pages.get({},api);
      _widgets = await api.engine.widgets.get({},api);
      
      await this.setTmpFile("pages",_pages);
      await this.setTmpFile("widgets",_widgets);

      updated = true;

    }

    if (conf.mock.use) {
      _pages = require('../mocks/pages.json');
      _widgets = require('../mocks/widgets.json');
    }
    
    conf.widgets = _widgets;
    this.cashed = await this.check((this.cashed||_pages),files);
    let session;
    try {
      session = await require("./session")();
    } catch (err) {
      session = {err: true, message:"can't connect"};
    }
    

    return {
      pages: this.cashed,
      api,
      langs,
      session
    };

  },
  
  async joinWidgets(widgets) {
    return Promise.all(   widgets.map(  element => new Promise( (res,rej)=>{
      fs.readFile('widgets/'+element+'.js', 'utf8', function(err, contents) {
          let trimed = contents.trim();
          res(!trimed ? `rosa.widgets.classes["${element.toUpperCase()}"]=false;` : `rosa.widgets.classes["${element.toUpperCase()}"]=${trimed}`);
          if (err) rej(err)
      });
    } )  )   );

  },
  
  async check(pages,files) {
    let output = {};
    conf.pages = {};
    return new Promise(async(res)=>{
      let layoutLog = [];
      let jsLog = [];
      for (let index = 0; index < pages.length; index++) {
          const page = pages[index];
          page.redirect = !!page.redirect;
          if (!!page.parent) {
            page.path = pages.filter((i)=>i.id===page.parent)[0].path + page.path;
          }
          
          page.script = `/cdn/pages${page.path}.js`;
    
          if (files.indexOf("pug")>=0 && !page.redirect) {
            layoutLog.push("b");
            layoutLog.push("file: "+`pages${page.path}.pug`);

            page.rf = pug.compile( await this.addLayOut(page) , {
              basedir: __dirname + "/../"
            });
            
            page.widgets = page
              .rf
              .dependencies
              .map(item=>{
                return item.split("/widgets/")[1]
              }
              )
              .filter(i=>!!i)
              .map(item=>item
                .split(".pug")[0]
              );
          }

          if (files.indexOf("js")>=0 && !page.redirect) {
            
            jsLog.push("b");
            jsLog.push("file: "+page.script);

            page.widgetsScript = "";
            let data = await this.joinWidgets(page.widgets);
            page.widgetsScript = "\n"+data.join("\n");
            
          }

          const j = JSON.parse;
          console.log();
          console.log(page.roles);
          page.roles = j(page.roles);

          output[page.path] = page;
          output[page.name] = page;

          conf.pages[page.name] = {
            redirect: page.redirect,
            href: page.path,
            name: page.name,
            roles: page.roles.length ? page.roles : false,
            id: page.id
          }
          
        }

        conf.log("c","layout worker end with: ",layoutLog);
        conf.log("c","Js worker end with: ",jsLog);

        res(output);

    })
  },
  async addLayOut(obj) {
    const fileLink = `pages${obj.path}.pug`;
    let compiled = "";

    function modify() {

      const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(fileLink)
      });

      return new Promise((res)=>{
        lineReader.on('line', (line) => {
          compiled += line+"\n";
        });
        lineReader.on('close', ()=>{
          function ra (obj,search,replace){
            return obj.split(search).join(replace);
          }
          console.log(obj.path)
          const pageName = ra(obj.path,"/","--");

          obj.pageName = pageName.substr(2);

          const result = `extends /system/layout.pug\n${compiled}\n`;
          res(result);
        })
      });

    }

    try {
      if (fs.existsSync(fileLink)) {
        return await modify();
      } else {
        conf.log("y","Atention",["m",'no file: '+fileLink+' but page exist on db']);
        return ""
      }
    } catch(err) {
      return err;
    }
    
  }
}