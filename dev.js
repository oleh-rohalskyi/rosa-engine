var watch = require('node-watch');
var procces = require('./server.js');

var server = null;

function refreshServer(serv) {
  server = serv;
}

procces((serv)=>{
  console.log("server started");
  refreshServer(serv);
  watch('./', { 
    recursive: true, 
    filter: f => !/node_modules/.test(f),
    delay: 1000
  }, function(evt, name) {
    if (!server) {
      procces(refreshServer);
    } else {
      server.close(()=>{console.log("server stopped")});
      procces(refreshServer);
      console.log('%s changed. %s restarted', name, "server");
    }
  });
})

