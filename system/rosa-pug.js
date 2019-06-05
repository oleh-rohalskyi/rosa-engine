const pug = require('pug');
const path = require('path');
const fs = require('fs');
const data = require('./data');

module.exports = {
    async check(obj,mission) {
        const fileLink = `./views/pages/${obj.template}.pug`;

        switch(mission.key) {
          case "cashed":
            if(obj[mission.key] === mission.value) {
              obj.compiledFunction = await precompilePage(obj);
            }
          default: 
            obj.compiledFunction = await precompilePage(obj);
        }
        
        if (obj.childrens) 
          for (var attr in obj.childrens)
            obj.childrens[attr] = await this.check(obj.childrens[attr], mission);
    
        return obj;
    },
    async compileToHTML(fileName) {
      const fileLink = path.join(__dirname, '../views/fragments',fileName);
      const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(fileLink)
      });
      return new Promise((res)=>{
        // lineReader.on('line', (line) => {
        //   compiled = compiled+"  "+line+"\n"
        // });
        lineReader.on('close', ()=>{
          res("extends /../../system/views/layout.pug\nblock content\n"+compiled);
        })
      });
    },
    async start() {
        const fragments = await this.collectFragments();
        console.log(fragments);
        const filledFragments = Promise.all(
          fragments.map(async fileName => ({
              fileName,
              htnl: await this.compileToHTML(fileName)
            })
          )
        );
        
        // console.log(fragments);
        
        let cashed = await this.check({childrens:pages},[{
            key: "cashed",
            value: true
        }]);
        return cashed.childrens;
    },
    async getData() {
      
    }
    async getData() {
        return new Promise((res)=>{
            const directoryPath = path.join(__dirname, '../views/fragments');
            fs.readdir(directoryPath, function (err, files) {
               
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                } 
                
                res(files);

            });
        })
        
        const rf = pug.render(rendered,{
            basedir: __dirname+"/rosa"
        });
        return rf
    },
    render() {

    },
    async addLayOut(fileLink) {
        
        const fragments = await this.collectFragments();
        console.log(fragments);

        let compiled = "";
        const lineReader = require('readline').createInterface({
          input: require('fs').createReadStream(fileLink)
        });
        return new Promise((res)=>{
          lineReader.on('line', (line) => {
            compiled = compiled+"  "+line+"\n"
          });
          lineReader.on('close', ()=>{
            res("extends /../../system/views/layout.pug\nblock content\n"
            +compiled);
          })
        });
      }
}