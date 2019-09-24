var watch = require('node-watch');
var startServer = require('./server');
var sass = require('node-sass');
var fs = require('fs');
var config = require("./configuration")
const templateWorker = require("./system/templates-worker");

Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) {
            return false;   
        }           
    }       
    return true;
}

Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

let server = null;

function procces(files) {
    return new Promise((res,rej)=>{
      templateWorker.start(files).then(({pages,widgets,api})=>{
        startServer(pages,widgets,config.d.port,api).then((newServ)=>{
          server = newServ;
          res();
        }).catch(e=>{rej(e)});
      })
    })
}

const update = function(files,evt,filename) {
  if (server !== null) {
    server.close( procces.bind(null,files) );
  } else {
    procces(files).catch(e=>console.log(e));
  }

  if (filename) {
    let ext = filename.split(".")[1];
    let left = filename.split(".")[0];
  }
    
}

function watchPug() {
  watch(['./pages','./widgets'], { 
    recursive: true, 
    filter: /\.pug$/,
    delay: 1000
  },throttle(update.bind(null,["pug"]),500));
}

function watchScript() {
  watch(['./pages','./widgets'], { 
    recursive: true, 
    filter: /\.js$/,
    delay: 1000
  },throttle(update.bind(null,["js"]),500));
}

function watchSass() {
  watch(['./pages','./widgets'], { 
    recursive: true,
    filter: /\.scss$/,
    sourceMap: true,
    delay: 1000
  }, function(s,filename){
    sass.render({
      file: "./system/main.scss",
    }, function(err, result) {
      if(err) {}
      else {
        fs.writeFile('./static/css/main.css', result.css, function(err){
         
        });
      }
        
     });
  });
}

if (config.d.env === "dev") {
  watchPug();
  watchSass();
  watchScript();
  update(["pug","js"]);
}

  


