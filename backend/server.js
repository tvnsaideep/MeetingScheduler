const app = require("./app");
//after installing nodemon , add below line
const debug = require("debug")("node-angular");
const http = require("http");
const appConfig = require("./config/appConfig");
const port = appConfig.port;
const mongoose = require('mongoose');


const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  //let db = mongoose.connect(appConfig.db.uri,{ useMongoClient: true });
};

//const port = normalizePort(process.env.PORT || "3000");
app.set("port", appConfig.port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(appConfig.port);
console.log(appConfig.port);


// socket io connection handler 
const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);
// end socketio connection handler
