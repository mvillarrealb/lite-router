"use strict"

const express    = require('express');
const LiteRouter = require("../").express;
const app        = express();

const api = require("./api")(app,LiteRouter);

api.start()