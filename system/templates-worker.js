const pug = require('pug');
const db = require('./db');

module.exports = {
  
  async start() {

    const pages = await db.getPages();
    const widgets = await db.getWidgets();
    let cashed = await this.check({childrens:pages});
    return {
      pages: cashed.childrens,
      widgets
    };

  },
  async check(obj) {
    
    if (obj.childrens && Object.keys(obj.childrens).length > 0)
      for (let attr in obj.childrens) {
        obj.childrens[attr].alias = attr;
        obj.childrens[attr] = await this.check(obj.childrens[attr]);
      }
      
    const fileLink = `./components/pages/${obj.template}.pug`;
    
    if (obj.template) {

      const rendered = await this.addLayOut(fileLink)
    
      obj.rf = pug.compile(rendered,{
        basedir: __dirname + "/../"
      });

      obj.widgets = obj.rf.dependencies.map( (item)=>{
        return item.split("components/widgets/")[1];
      } ).filter(i=>!!i).map(i=>i.split(".pug")[0]);
     
    }

    obj.pathnames = JSON.parse(obj.pathnames || "{}");
    obj.roles = JSON.parse(obj.roles || "{}");
    obj.data = JSON.parse(obj.data || "{}");
    obj.redirect = !!obj.redirect;
    obj.multilangual = !!obj.multilangual;
    

    return obj;
  },
  async addLayOut(fileLink) {

    let compiled = "";
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileLink)
    });
    return new Promise((res)=>{
      lineReader.on('line', (line) => {
        compiled = compiled+"      "+line+"\n";
      });
      lineReader.on('close', ()=>{
        console.log("prepare", fileLink)
        res(`extends /system/layout.pug \nblock content\n  div.page-${
          fileLink.replace("./components/pages/","").replace(".pug","")
        }\n${compiled}\n      script(type="text/javascript" src="/cdn/components/pages${
          fileLink.replace(".pug",".js").replace("./components/pages","")
        }")\n`);
      })
    });
  }
}