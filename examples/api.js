"use strict"

const path       = require("path");

module.exports = (app,LiteRouter) => {

    const controllers  = require(path.join(__dirname,"controllers"))();
    const middlewares  = require(path.join(__dirname,"middlewares"))();
    const routesList   = require(path.join(__dirname,"routes"))

    let routerHandler = LiteRouter.init({
        controllers: controllers,
        middlewares: middlewares
    });

    return {
        server: null,
        stop: () => {
            
            if(app.close && typeof app.close == "function") {
                app.close()
            } else {
                this.server.close()
            }
           
        },
        start: (done) => {
            routerHandler
            .publishRoutes(routesList)
            .then((handler) => {
                return handler.bindApplication(app);
            }).then((app) => {
               this.server = app.listen(8000,done);
            })
        }
    }

}