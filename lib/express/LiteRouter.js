"use strict"

const express    = require("express");
const BaseRouter = require("../BaseRouter");
const debug      = require("debug")("lite-router:express:LiteRouter");
/**
 * LiteRouter Express Implementation
 * 
 * @module lite-router:express
 * @author Marco Villarreal
 * @version 1.0.0
 * 
 */
class LiteRouter extends BaseRouter {
    /**
     * 
     * @param {Object} configOptions 
     */
    constructor(configOptions) {
        super(configOptions)
    }
    /**
     * Handles route publishing definition according to express standard
     * publishing
     * 
     * @method handleRoute
     * @param {String} httpVerb 
     * @param {String} endpoint 
     * @param {Array} executionFnStack 
     */
    handleRoute(httpVerb,endpoint,executionFnStack) {
        debug("Handling route publishing for endpoint %o with verb %o",endpoint,httpVerb);
        this.router[httpVerb](endpoint,executionFnStack);
    }
    /**
     * Create a new express router, this method will be invoked
     * automatically by the LiteRouter when invoking the
     * publishRoutes method
     * 
     * @method createRouter
     * @return {restify-router.Router}
     */
    createRouter() {
        debug("Creating a new express router");
        return express.Router();
    }
    /**
     * Binds the express application with the generated router
     * @method _bindApplication
     * @param {express.app} expressApp 
     */
    _bindApplication(expressApp) {
        debug("Binding routes for express Application");
        expressApp.use("/",this.router);
        debug("Express route Binding complete");
    }
    /**
     * Create a new express LiteRouter implementation based on the
     * configured options
     * 
     * @static
     * @param {Object} configOptions config options compatible with BaseRouter:constructor
     */
    static init(configOptions) {
        return new LiteRouter(configOptions);
    }
}

module.exports = LiteRouter;