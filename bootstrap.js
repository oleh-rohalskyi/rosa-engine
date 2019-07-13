const pug = require('pug');
const path = require('path');
const db = require('./system/db');
const fs = require('fs');
const env = process.env.NODE_ENV;
console.log(env);

async function pages() {
  const directoryPath = path.join(__dirname, '../views/pages');
      // await this.read(directoryPath);
  
  
  // const rf = pug.render(rendered,{
  //     basedir: __dirname+"/rosa"
  // });
  // return rf
}
async function check(obj,mission) {

  if (obj.template)
    pageFiles.push(`./views/pages/${obj.template}.pug`)

  if (obj.childrens) {
    for (var attr in obj.childrens) {
      obj.childrens[attr] = await check(obj.childrens[attr], mission);
    }
    
    
  } else {
    // switch(mission.key) {
    //   case "cashed":
    //     if(obj[mission.key] === mission.value) {
    //       // obj.compiledFunction = await precompilePage(obj);
    //     }
    //   default: 
    //     // obj.compiledFunction = await precompilePage(obj);
    // }
    

  }
  return obj;
  


}
async function start() {

  const config = env === "fetch_db" ? await db.getConfig() : loadConfig();
  
  const {fragments,pages} = config;

  let cashed = await check({childrens:pages},[{
      key: "cashed",
      value: true
  }],fragments);

  console.log(pageFiles);
  
  return Promise.all(pageFiles.map(
    async link => {
      return await addLayOut(link,fragments);
    }
  ))
  
}
function createFile(link) {
  return new Promise((res)=>{
    fs.writeFile(link, `div ${link}`, (err) => {
      console.log(err)
      if (err) throw err;
      console.log("file created")
      res(null);
    }); 
  })
  
}
function addLayOut(filename,fragments) {
  
  link = path.join(__dirname,filename);
 
  return new Promise((res)=>{
  
    exist(link).then((success)=>{
      writeFile(link).then(res);
    });

      path.exists('foo.txt', function(exists) { 
        if (exists) { 
          
        } else {
          
        }
      });
        fs.access(link, fs.F_OK,(err) => {
          if (err) {
            // console.log("no file",err);
            
          } else {
            writeFile(link).then(res);
          }
        }
      )
    
        
  });

}
async function writeFile(link) {
  
  let compiled = "";
  return new Promise(res=>{
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(link)
    });
    lineReader.on('line', (line) => {
      compiled = compiled+"  "+line+"\n"
    });
    lineReader.on('close', () => {
      
      const template = "extends /../../system/views/layout.pug\nblock content\n"+compiled;
      res(template);
    })
  })
}

start().then(console.log)

