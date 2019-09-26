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

    let _pages = {};
    let _widgets = {};
    let langs = await conf.getLangs();

    if (conf.mock.update && !updated) {
      
      _pages = await api.engine.pages.get(null,api);
      _widgets = await api.engine.widgets.get(null,api);

      await this.setTmpFile("pages",_pages);
      await this.setTmpFile("widgets",_widgets);

      updated = true;

    }

    if (conf.mock.use) {
      _pages = require('../mocks/pages.json');
      _widgets = require('../mocks/widgets.json');
    }

    this.cashed = await this.check((this.cashed||_pages),files);
    console.log(langs);
    return {
      pages: this.cashed,
      widgets: _widgets,
      api,
      langs
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
    return new Promise(async(res)=>{
      for (let index = 0; index < pages.length; index++) {
          const page = pages[index];
          page.redirect = !!page.redirect;
          if (!!page.parent) {
            page.path = pages.filter((i)=>i.id===page.parent)[0].path + page.path;
          }
          
          page.script = `/cdn/pages${page.path}.js`;
    
          if (files.indexOf("pug")>=0 && !page.redirect) {
    
            page.rf = pug.compile( await this.addLayOut(page) , {
              basedir: __dirname + "/../"
            });
            
            page.widgets = page.rf.dependencies.map( (item)=>{
              return item.split("/widgets/")[1];
            } ).filter(i=>!!i).map(i=>i.split(".pug")[0]);
    
          }

          if (files.indexOf("js")>=0 && !page.redirect) {

            page.widgetsScript = "";
            let data = await this.joinWidgets(page.widgets);
            page.widgetsScript = "\n"+data.join("\n");
            
          }

          const j = JSON.parse;

          page.roles = j(page.roles);
          output[page.path] = page;
          output[page.name] = page;
          
        }

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

    try {
      if (fs.existsSync(fileLink)) {
        return await modify();
      } else {
        return ""
      }
    } catch(err) {
      return err;
    }
    
  }
}