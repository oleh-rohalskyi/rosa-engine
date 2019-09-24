const pug = require('pug');
const db = require('./db');
const fs = require('fs');

const {d,aliases} = require('../configuration');

let updated = false;
const Api = require('../api');


module.exports = {
  routes: [],
  async setTmpFile(name,data) {
    return new Promise((res,rej)=>{
      fs.writeFile("./configuration/"+name+".json", JSON.stringify(data), function(err) {
        if (err) {
          rej(err);
        }
        res();
      })
    })
  },
  async start(files) {
    const config = await Api.getConf();
    const api = new Api(config)
    this.files = files;
    this.widgetScreenShoots = [];
      let _pages = {};
      let _widgets = {};
    if (d.update_db_mock && !updated) {
      _pages = await api.engine.pages();
      _widgets = await api.engine.widgets();
      await this.setTmpFile("pages",_pages);
      await this.setTmpFile("widgets",_widgets);
      updated = true;
    }

    if (d.db_mock) {
      _pages = require('../configuration/pages.json');
      _widgets = require('../configuration/widgets.json');
    }
    
    this.cashed = obj = await this
      .check((this.cashed||_pages),null);
    
  
    return {
      pages: this.cashed,
      widgets: _widgets,
      api
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
  async check(next,parent) {
    let childrens = next.childrens && next.childrens.length ? next.childrens : null;
    childrens = Array.isArray(next) ? next : null || childrens;
    if (!next.childrens) {
      next.childrens = [];
    }
    if (childrens) {
      
      childrens.forEach(async(el,index)=>{
        next.childrens[index] = await this.check(el,next);
      })

    }
  

    if (next.path) {
      next.script = `/cdn/pages/${next.path}.js`;

      if (this.files.indexOf("pug")>=0) {

        next.rf = pug.compile( await this.addLayOut(next) , {
          basedir: __dirname + "/../"
        });
        
        next.widgets = next.rf.dependencies.map( (item)=>{
          return item.split("/widgets/")[1];
        } ).filter(i=>!!i).map(i=>i.split(".pug")[0]);

      }

      if (this.files.indexOf("js")>=0) {
        next.widgetsScript = "";
        let data = await this.joinWidgets(next.widgets);
        next.widgetsScript = "\n"+data.join("\n");
      }
    
    }
    
    const j = JSON.parse;
    next.pathnames = typeof next.pathnames == "object" ? next.pathnames : j(next.pathnames || "{}");
    next.roles = typeof next.roles == "object" ? next.roles : j(next.roles || "{}");
    next.data = typeof next.data == "object" ? next.data : j(next.data || "{}");
    next.redirect = !!next.redirect;
    next.multilangual = !!next.multilangual;
    aliases[next.path] = next;
    return next;
  },
  async addLayOut(obj) {
    const fileLink = `./pages/${obj.path}.pug`;
    let compiled = "";
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileLink)
    });
    return new Promise((res)=>{
      lineReader.on('line', (line) => {
        compiled = compiled+"      "+line+"\n";
      });
      lineReader.on('close', ()=>{
        const pageName = obj.path.replace("/","--");
        obj.pageName = pageName;
        const result = `extends /system/layout.pug \nblock content\n  div.page.page__${pageName}\n${compiled}\n`;
        res(result);
      })
    });
  }
}