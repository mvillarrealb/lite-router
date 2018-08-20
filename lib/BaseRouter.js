"use strict"

const debug = require("debug")("lite-router:BaseRouter");
/**
 * 
 * BaseRouter represents the basic lite-router core, it handles the base router building
 * and publishing resolution, however has two basic methods unimplemented:
 * - handleRoute
 * - createRouter
 * Booth of them are implemented by the express and restify liteRouter implementations
 * 
 * @author Marco Villarreal
 * @since 19/08/2018
 * @version 1.0.0
 * 
 */
class BaseRouter {
    /**
     * Create a new instance of the liteRouter
     * @constructor
     * @param {Object} configOptions
     */
    constructor(configOptions) {
        this.defaultMiddlewares = [];
        this.controllers = null;
        this.middlewares = null;
        this.router = this.createRouter();
        
        if ( configOptions && configOptions.defaultMiddlewares ) {
           this.defaultMiddlewares = configOptions.defaultMiddlewares;
        }

        if ( configOptions && configOptions.controllers ) {
           this.controllers = configOptions.controllers;
        } else if(configOptions && configOptions.controllersPath ) {
           this.controllers = require(configOptions.controllersPath);
        } else {
           throw "Missing properties [controllers/controllersPath], you must specify one of them!"
        }
 
        if ( configOptions && configOptions.middlewares ) {
           this.middlewares = configOptions.middlewares;
        } else if (configOptions && configOptions.middlewaresPath ) {
           this.middlewares = require(configOptions.middlewaresPath);
        } else {
           throw "Missing properties [middlewares/middlewaresPath], you must specify one of them!"
        }
    }
    
    set router(router) {
        this._router = router;
    }
    
    get router() {
        return this._router;
    }
    /**
     * 
     * Handle route publishing based on a list of routes
     * 
     * @method publishRoutes
     * @param {Array} routesList The list of routes with the lite-router definition syntax
     * @return {Promise} a promise resolved by the successfully publishing of routes
     * 
     */
    publishRoutes(routesList) {
        return new Promise((resolve,reject) => {
            if( routesList && routesList.forEach ) {
                routesList.forEach(routeDefinition => {
                    if( this.isValidRouteDefinition(routeDefinition) ) {
                       this.publish(routeDefinition.httpVerb,routeDefinition.route,routeDefinition.action,routeDefinition.middlewares); 
                    } else {
                       throw new Error(`Route definition Object ${routeDefinition}  is not valid`);
                    }
                });
                return resolve(this);
            } else {
                return reject(new Error("Specified routes to publish is invalid or is empty"));
            }
        })
        
    }
    /**
     * Determines if a route definition is valid based on the presence of the required parameters:
     * - httpVerb
     * - route
     * - action
     * 
     * @param {Object} routeDefinition Route definition object
     * @return {Boolean} Returns if the route is valid
     */
    isValidRouteDefinition(routeDefinition) {
        debug("Validating if route definition is valid")
        let verbIsValid = (routeDefinition && routeDefinition.httpVerb)? true : false;
        let routeIsValid = (routeDefinition && routeDefinition.route)? true : false;
        let actionIsValid = (routeDefinition && routeDefinition.action)? true : false;
        
        debug("Route definition result verbIsValid:%o routeIsValid %o actionIsValid %o",verbIsValid,routeIsValid,actionIsValid)
        
        return ( verbIsValid && routeIsValid && actionIsValid );
    }

    bindApplication(app) {
        return new Promise((resolve,reject)=> {
            if( app != null ) {
                this._bindApplication(app);
                resolve(app);
            } else {
                reject(new Error("app cannot be null"))
            }
        })
    }
    /**
     * Perform a publish on the router implementation
     * 
     * @method publish
     * @param {String} httpVerb HTTP Verb to be used by the router
     * @param {String} endpoint The endpoint to be published by the router
     * @param {String} actionString The action string to be resolved into a executable function
     * @param {Array} middlewares Optional list of middlewares, can be booth an array of functions or an array of actionString
     */
    publish (httpVerb,endpoint,actionString,middlewares = [] ) {
        let executionFnStack = [];
        /**
         * Check for default middleware in the stack
         */
        for(let i = 0; i < this.defaultMiddlewares.length;i++){
            let middleware = this.defaultMiddlewares[i];
            if( typeof middleware == "function" ) {
                executionFnStack.push(middleware);
            } else {
                throw new Error("Default Middleware is not a function");
            }
        }
        /**
         * Check for assigned middleware in publish definition
         */
        if( middlewares && middlewares.length > 0 ) {
            middlewares.forEach((middlewareString) => {
                executionFnStack.push(this.resolveActionString(middlewareString, true ));
            });
        }
        /**
         * Resolve controller?action syntax for main action
         */
        let controllerActionFnBind = this.resolveActionString(actionString);
        
        executionFnStack.push(controllerActionFnBind);

        this.handleRoute(httpVerb.toLowerCase(),endpoint,executionFnStack);
    }

    handleRoute(httpVerb,endpoint,executionFnStack) {
        throw new Error("You must override handleRoute method to create a routing implementation");
    }

    createRouter() {
        throw new Error("You must override createRouter method to create a routing implementation");
    }
    /**
     * Extracts from an action string the controller?action to be executed
     * and converts it into a fully executable resolution function applied
     * to the specified scope
     * 
     * @method resolveActionString
     * @param {String} actionString The actionString to be resolved into a function
     * @param {Boolean} checkMiddlewares Determines if the actionString has to be verified into the middlewares
     * @returns {Function} The fully executable action function with the required scope applied
     */
    resolveActionString(actionString,checkMiddlewares = false) {
        let resolutionFunc = null;

        if ( typeof actionString == "function" ) {
            resolutionFunc = actionString;
        } else if ( typeof actionString == "string" ) {

            if ( actionString.indexOf("?") > 0 ) {
                let controllerAction = actionString.split('?');
                let controllerName = controllerAction[0];
                let actionName     = controllerAction[1];

                if ( this.controllers[controllerName] ) {
                    if ( this.controllers[controllerName][actionName] ) {
                        let controller = this.controllers[controllerName];
                        resolutionFunc = controller[actionName].bind(controller);
                    } else {
                        throw new Error(`Action method ${actionName} does not exists check your route definition ${actionString}`);
                    }
                } else {
                    throw new Error(`Controller ${controllerName} is not defined check your route definition ${actionString}`);
                }

            } else if (checkMiddlewares) {
                if ( this.middlewares && this.middlewares[actionString] ) {
                   resolutionFunc = this.middlewares[actionString];
                }
            }

        } else {
            throw "specified Middleware not valid";
        }

        return resolutionFunc;
    }
}

module.exports = BaseRouter;