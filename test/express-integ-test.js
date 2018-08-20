"use strict"

const express    = require("express");
const app        = express();
const bodyParser = require('body-parser');
const LiteRouter = require("../").express

app.use(bodyParser.json())

const server     = require("../examples/api")(app,LiteRouter)
const appTests   = require("./util/integTestBase")(server);

describe("express api integration test",appTests);