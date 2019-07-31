var watch = require('node-watch');
var servStart = require('./server.js');
var chalk = require('chalk');

const args = require('yargs').argv;
const templateWorker = require("./system/templates-worker.js");

let server = null;
let port = 3000;

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

const update = (evt,filename) =>{

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
  }, update);
}

process.env.NODE_ENV = args.env;

if (process.env.NODE_ENV === "dev") {
  port = 3001;
  update();
  watchPug();
  watchSass();
}

  


