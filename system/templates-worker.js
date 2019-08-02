const db = require('./db');
const pug = require('pug');

module.exports = {
  async start() {

    const { pages } = await db.getConfig();
    let cashed = await this.check({childrens:pages},[{
        key: "cashed",
        value: true
    }]);

    return cashed.childrens;

  },
  async check(obj,mission) {
    
    if (obj.childrens && Object.keys(obj.childrens).length > 0)
      for (let attr in obj.childrens) {
        obj.childrens[attr].alias = attr;
        obj.childrens[attr] = await this.check(obj.childrens[attr], mission);
      }
      
    const fileLink = `./components/pages/${obj.template}.pug`;
    
    
    if (obj.template) {

      const rendered = await this.addLayOut(fileLink)
    
      obj.rf = pug.compile(rendered,{
        basedir: __dirname + "/../"
      });

    }
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
        console.log(fileLink.replace(".pug",""))
        // console.log(`extends /system/layout.pug \nblock content\n` +compiled+ `      script(type="text/javascript" src="/cdn/components/pages/${fileLink}.js")`)
        res(`extends /system/layout.pug \nblock content\n  div.page\n${compiled}\n      script(type="text/javascript" src="/cdn/components/pages${
          fileLink
            .replace(".pug",".js")
            .replace("./components/pages","")
          }")\n`);
      })
    });
  }
}