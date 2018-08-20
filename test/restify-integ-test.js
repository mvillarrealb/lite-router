"use strict"

const restify    = require("restify");
const app        = restify.createServer();
const LiteRouter = require("../").restify;

app.use(restify.plugins.bodyParser());

const server     = require("../examples/api")(app,LiteRouter)
const appTests   = require("./util/integTestBase")(server);

describe("restify api integration test",appTests);