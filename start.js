var watch = require('node-watch');
var servStart = require('./server.js');
var chalk = require('chalk');
var sass = require('node-sass');
var fs = require('fs');

const args = require('yargs').argv;

process.env.NODE_ENV = args.env;
process.env.CON = process.env.CONNECTION = args.con || args.connection;
process.env.PORT = args.port;

const templateWorker = require("./system/templates-worker.js");

let server = null;
let port = process.env.PORT*1 || 3001 ;

function procces(message) {
    return new Promise((res,rej)=>{
      templateWorker.start().then((readyPages)=>{
        servStart(readyPages,port).then((newServ)=>{
          server = newServ;
          console.log(`${chalk.green('server')}  listen on port ${chalk.yellow(port)}`)
          console.log(message);
          res();
        });
      })
    })
}

const update = function(evt,filename) {

  if (server !== null) {
    server.close(procces.bind(null,`${chalk.green('server')}  restarted`));
  } else {
    procces(`${chalk.green('server')}  started from strach`);
  }

  if (filename) {
    let ext = filename.split(".")[1];
    let left = filename.split(".")[0];
    console.log(`${chalk.blue('updated')} ${left+"."+chalk.yellow(ext)}`);
  }
    
}

function watchPug() {
  console.log(chalk.blue('watch') + "   pug");
  watch('./components', { 
    recursive: true, 
    filter: /\.pug$/,
    delay: 1000
  },update);
}

function watchSass() {
  console.log(chalk.blue('watch') + "   scss");
  watch('./components', { 
    recursive: true,
    filter: /\.scss$/,
    sourceMap: true,
    delay: 1000
  }, function(s,filename){
    sass.render({
      file: "./system/main.scss",
    }, function(err, result) {
      if(err)
        console.log(chalk.red('error') + chalk.yellow("   scss\n") + err.formatted);
      else
        fs.writeFile('./static/css/main.css', result.css, function(err){
          console.log(err);
          if(!err){
            update();
          }
        });
     });
  });
}

if (process.env.NODE_ENV === "dev") {
  update();
  watchPug();
  watchSass();
}

  


