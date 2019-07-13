const pug = require('pug');
const path = require('path');
const exist = require('path-exists');
const db = require('./db');
const fs = require('fs');


module.exports = {
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
    async check(obj,mission) {
      
      // for (let index = 0; index < mission.length; index++) {
      //   const element = mission[index];
      //   switch(mission.key) {
      //     case "cashed":
      //       if(obj[mission.key] === mission.value) {
      //         let is = await exist(fileLink);
      //         console.log(is);
      //         // obj.compiledFunction = await precompilePage(obj);
      //       }
      //     default: 
      //       // obj.compiledFunction = await precompilePage(obj);
      //   }
      // }

      if (obj.childrens && Object.keys(obj.childrens).length > 0)
        for (let attr in obj.childrens) {
          obj.childrens[attr] = await this.check(obj.childrens[attr], mission);
        }

      const fileLink = `./views/pages/${obj.template}.pug`;
      
      console.log(fileLink);

      return obj;

    },
    async start() {
      const {pages, fragments} = await db.getConfig();
      this.fragments = fragments;
      this.pages = pages;

      let cashed = await this.check({childrens:pages},[{
          key: "cashed",
          value: true
      }]);

      return cashed.childrens;
    },
    async read(pagesPath) {
      return new Promise((res)=>{
        fs.readdir(pagesPath, function (err, files) {
        
          for (let i = 0; i < files.length; i++) {
            const isDirectory = fs.lstatSync(files[i]).isDirectory();
          
          }

          console.log(directoryPath,isDirectory);

           if (err) {
               return console.log('Unable to scan directory: ' + err);
           } 

         });
      })
    },
    async pages() {
      const directoryPath = path.join(__dirname, '../views/pages');
            // await this.read(directoryPath);
        
        
        // const rf = pug.render(rendered,{
        //     basedir: __dirname+"/rosa"
        // });
        // return rf
    },
    render() {

    },
    async addLayOut(fileLink) {
        
        // const fragments = await this.collectFragments();
        // console.log(fragments);

        let compiled = "";
        const lineReader = require('readline').createInterface({
          input: require('fs').createReadStream(fileLink)
        });
        return new Promise((res)=>{
          lineReader.on('line', (line) => {
            line = line.replace(/{%.*?%}/g,"");
            compiled = compiled+"  "+line+"\n"
          });
          lineReader.on('close', ()=>{
            res("extends /../../system/layout.pug\nblock content\n"
            +compiled);
          })
        });
      }
}