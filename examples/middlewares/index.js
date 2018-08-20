'use strict';

const moduleLoader = require("mod-loader");
const fs           = require("fs");
const path         = require("path");

module.exports = () => {
   let middlewares    = {};
   moduleLoader.loadModulesSync({
     baseDirectory: path.join(__dirname),
     moduleHolder: middlewares,
     doNotInclude: [
       "index.js"
     ]
   },(moduleLoaded) => {
     return require(moduleLoaded)();
   });

   return middlewares;
}
