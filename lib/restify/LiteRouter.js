"use strict"

const Router     = require('restify-router').Router;
const BaseRouter = require("../BaseRouter");
const debug      = require("debug")("lite-router:restify:LiteRouter");
/**
 * LiteRouter Restify Implementation, it use restify-router to create
 * routing publishing in the same way routes are published in express
 * 
 * @module lite-router:restify
 * @author Marco Villarreal
 * @version 1.0.0
 * 
 */
class LiteRouter extends BaseRouter {

    constructor(configOptions) {
        super(configOptions)
    }
    /**
     * Handles route publishing definition according to restify standard
     * publishing
     * 
     * @method handleRoute
     * @param {String} httpVerb 
     * @param {String} endpoint 
     * @param {Array} executionFnStack 
     */
    handleRoute(httpVerb,endpoint,executionFnStack) {
        debug("Handling route publishing for endpoint %o with verb %o",endpoint,httpVerb);
        httpVerb = (httpVerb == "delete") ? "del" :  httpVerb;//Special handling for restify delete verb
        this.router[httpVerb](endpoint,executionFnStack);
    }
    /**
     * Create a new restify router, this method will be invoked
     * automatically by the LiteRouter when invoking the
     * publishRoutes method
     * 
     * @method createRouter
     * @return {restify-router.Router}
     */
    createRouter() {
        return new Router();
    }
    /**
     * Binds the restify application with the generated router
     * @method _bindApplication
     * @param {restify.server} restifyApp 
     */
    _bindApplication(restifyApp) {
        debug("Binding routes for restify Application");
        this.router.applyRoutes(restifyApp);
        debug("Restify route Biding complete");
    }
    /**
     * Create a new restify LiteRouter implementation based on the
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