'use strict';

const moduleLoader = require("mod-loader");
const fs           = require("fs");
const path         = require("path");

module.exports = () => {
   let controllers    = {};
   moduleLoader.loadModulesSync({
     baseDirectory: path.join(__dirname),
     moduleHolder: controllers,
     doNotInclude: [
       "index.js"
     ]
   },(moduleLoaded) => {
     return require(moduleLoaded);
   });
   return controllers;
}
