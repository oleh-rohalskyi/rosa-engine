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
      
    const fileLink = `./views/pages/${obj.template}.pug`;
    
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
        compiled = compiled+"  "+line+"\n"
      });
      lineReader.on('close', ()=>{
        res(`extends /system/layout.pug \nblock content\n`
        +compiled);
      })
    });
  }
}