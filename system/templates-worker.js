const pug = require('pug');
const db = require('./db');
const data = require('../temp/index');
const fs = require('fs');
const {db_mock,update_db_mock} = require('./config');

let updated = false;

module.exports = {
  routes: [],
  async setTmpFile(name,data) {
    return new Promise((res,rej)=>{
      fs.writeFile("./temp/"+name+".json", JSON.stringify(data), function(err) {
        if (err) {
          rej(err);
        }
        res();
      })
    })
  },
  async start(files) {
    this.widgetScreenShoots = [];
    // if (!this.cashed) {
    //   this.cashed = [];
    // }
      let pages = {};
      let widgets = {};

    if (update_db_mock && !updated) {
      pages = await db.api["pages-get"]();
      widgets = await db.api["widgets-get"]();
      this.setTmpFile("pages",pages);
      this.setTmpFile("widgets",widgets);
      updated = true;
    }

    if (db_mock) {
      pages = data.pages;
      widgets = data.widgets;
    } else {
      pages = await db.api["pages-get"]();
      widgets = await db.api["widgets-get"]();
    }

    let obj = await this
      .check({childrens:(this.cashed||pages)},files);

    this.cashed = obj.childrens
    
    return {
      pages: this.cashed,
      widgets
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
  async check(obj,files) {
    
    if (obj.childrens && Object.keys(obj.childrens).length > 0) {
      obj.childrens.forEach(async(el,index)=>{
        obj.childrens[index] = await this.check(obj.childrens[index],files);
      })
    }

    if (obj.template) {

      obj.script = `/cdn/pages/${obj.template}.js`;

      if (files.indexOf("pug")>=0) {

        obj.rf = pug.compile( await this.addLayOut(obj) , {
          basedir: __dirname + "/../"
        });

        obj.widgets = obj.rf.dependencies.map( (item)=>{
          return item.split("widgets/")[1];
        } ).filter(i=>!!i).map(i=>i.split(".pug")[0]);

      }

      if (files.indexOf("js")>=0) {
        obj.widgetsScript = "";
        let data = await this.joinWidgets(obj.widgets);
        obj.widgetsScript = "\n"+data.join("\n");
        obj.widgetsScript;
      }
      

      

    }
    
    const j = JSON.parse;
    obj.pathnames = typeof obj.pathnames == "object" ? obj.pathnames : j(obj.pathnames || "{}");
    obj.roles = typeof obj.roles == "object" ? obj.roles : j(obj.roles || "{}");
    obj.data = typeof obj.data == "object" ? obj.data : j(obj.data || "{}");
    obj.redirect = !!obj.redirect;
    obj.multilangual = !!obj.multilangual;

    return obj;
  },
  async addLayOut(obj) {
    const fileLink = `./pages/${obj.template}.pug`;
    let compiled = "";
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileLink)
    });
    return new Promise((res)=>{
      lineReader.on('line', (line) => {
        compiled = compiled+"      "+line+"\n";
      });
      lineReader.on('close', ()=>{
        const pageName = obj.template.replace("/","--");
        obj.pageName = pageName;
        const result = `extends /system/layout.pug \nblock content\n  div.page.page__${pageName}\n${compiled}\n`;
        res(result);
      })
    });
  }
}