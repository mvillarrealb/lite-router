"use strict"

const restify    = require("restify");
const LiteRouter = require("../").restify;
const app        = restify.createServer();

const api = require("./api")(app,LiteRouter);

api.start()