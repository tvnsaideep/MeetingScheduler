const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appConfig = require("./config/appConfig");
const fs = require('fs');
const logger = require('./app/libs/loggerLib');
//Install mongoose, before
//onst mongoose = require('mongoose');
//set CORS 
const libsPath = './app/libs';
const middlewaresPath = './app/middlewares';
const controllersPath = './app/controllers';
const modelsPath = './app/models';
const routesPath = './app/routes';

/**
 * database
*/
 mongoose.connect(appConfig.db.url,{useNewUrlParser:true})
.then(() => {
  console.log("Connection Established");
})
.catch(() => {
  console.log("Failed");
  //console.error();
  
});

 
 

/**
 * database connection settings
 *
mongoose.connection.on('error', function (err) {
  console.log('database connection error');
  console.log(err)
  logger.error(err,
    'mongoose connection on error handler', 10)
  //process.exit(1)
}); // end mongoose connection error

mongoose.connection.on('open', function (err) {
  if (err) {
    console.log("database error");
    console.log(err);
    logger.error(err, 'mongoose connection open handler', 10)
  } else {
    console.log("database connection open success");
    //console.log(libs.isSameDayAsToday(Date()))

    logger.info("database connection open",
      'database connection open handler', 10)
  }
  //process.exit(1)
}); 
// enr mongoose connection open handler
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client')));

app.all('*',(req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});


//Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models


// Bootstrap route
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    route.setRouter(app);
  }
});
// end bootstrap route

app.get('/api/v1/auth',(req,res,next) => {
    console.log("Sent");

    return res.status(200).json({'msg':'connected','data':req.body.email});

});

module.exports = app;