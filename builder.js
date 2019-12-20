const conf = require('./conf/app.config');
const pug = require('pug');
const _fs = require('fs');
const fs = _fs.promises;
// const indentString = require('indent-string');

conf.pages = [];
module.exports = {
  async modifyPages(pages) {
    
    let output = {};

    return new Promise(async(res)=>{
     
      for (let index = 0; index < pages.length; index++) {

          let page = pages[index];
          page.redirect = !!page.redirect;

          if (!!page.parent) {
            page.path = pages.filter((i)=>i.id===page.parent)[0].path + page.path;
          }
          
          page.script = `/dist/js${page.path}.js`;
          
          if (!page.redirect) {
            const result = await this.addLayOut(page);
            if (result.success) {
              const deps = page
                .rf
                .dependencies;
              page.widgets = deps.map(item=>{
                  return item.split("/widgets")[1]
                })
                .filter(i=>{
                  return !!i
                })
                .map(item=>{
                  return item
                  .split(".pug")[0]
                });
            } else {
              console.log(result.message)
            }
            
           
            
            
          }

          page.roles = Array.isArray(page.roles) ? page.roles : JSON.parse(page.roles);
          page.js_deps = Array.isArray(page.js_deps) ? page.js_deps : page.js_deps.split(",").filter(i=>i);
          output[page.path] = page;
          // output[page.name] = page;

          conf.pages[page.path] = {
            redirect: page.redirect,
            href: page.path,
            name: page.name,
            roles: page.roles.length ? page.roles : false,
            id: page.id,
            link: output[page.name]
          }
          
        }

        res(output);

    })
  },
  async addLayOut(obj) {

    const fileLink = `pug/pages${obj.path}.pug`;
    let splt = obj.path.split("/");
    let filename = splt[splt.length-1];

    async function modify() {
      let content = await fs.readFile(fileLink);
      content = "extends pug/layout.pug\n" + content;
      return content;
    }

    try {
      if (_fs.existsSync(fileLink)) {
        let content = await modify();
        obj.rf = pug.compile( content, {
          basedir: __dirname + "/pug/",
          filename: filename
        });
        return {success: true, data: obj};
      } else {
        return {success: false,message:'no file: '+fileLink+' but page exist on db'};
      }
    } catch(error) {
      return {success: false,message:error.toString()}
    }
    
  }
}