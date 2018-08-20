
const path    = require("path");
const expect  = require("chai").expect;
const chai    = require("chai")
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

module.exports = (liteRouter) => {
    return () => {
        let route = liteRouter.init({
            controllers: {
                dummy: {
                    get: function(req,res,next) {
    
                    },
                    post: function(req,res,next) {
    
                    }
                }
            },
            middlewares: {
                checkFoo: function(req,res,next) { next();}
            },
            defaultMiddlewares: [
                function(req,res,next) {
                    next();
                }
            ]
        });
        /*
        it("Should be able to get router instance",function() {
            let router = route.router;
            let routerB = route.getRouter();
            console.log(routerB)
            console.log(router);
        })*/
        
        it("Should be able to throw error when routes to publish is invalid",function() {
            return liteRouter.init({
                controllers: {
                    dummy: {
                        get: function(req,res,next) {
        
                        }
                    }
                },
                middlewares: {
                    checkFoo: function(req,res,next) { next();}
                },
                defaultMiddlewares: [
                    "i am not a function"
                ]
            })
            .publishRoutes("get","/test","dummy?get")
            .should.be.rejectedWith("Specified routes to publish is invalid or is empty")

        });

        it("Should be able to throw error when default middleware is invalid",function() {
            return liteRouter.init({
                controllers: {
                    dummy: {
                        get: function(req,res,next) {
        
                        }
                    }
                },
                middlewares: {
                    checkFoo: function(req,res,next) { next();}
                },
                defaultMiddlewares: [
                    "i am not a function"
                ]
            })
            .publishRoutes([
                {
                    httpVerb:"get",
                    route:"/dummy",
                    action:"dummy?get",
                    middlewares: [
                        "checkFoo",
                        function(req,res,next){
                            next();
                        }
                    ]
                }
            ])
            .should.be.rejectedWith("Default Middleware is not a function")
            //.publishRoutes("get","/test","dummy?get")
        });
        
        it("Should be able to create lite-router from require parameters",function() {
            let routeInstance = liteRouter.init({
                controllersPath: path.join(__dirname,"../../examples/controllers"),
                middlewaresPath: path.join(__dirname,"../../examples/middlewares")
            });
        });
    
        it("Should be able to publish routes without problems",function(done) {
            route.publishRoutes([
                {
                    httpVerb:"get",
                    route:"/dummy",
                    action:"dummy?get",
                    middlewares: [
                        "checkFoo",
                        function(req,res,next){
                            next();
                        }
                    ]
                }
            ]).then((rout) => {
                //console.log(rout)
                done()
            });
        });
        
        it("Should be able to detect initialization errors",function() {
            
            expect(function() {
                liteRouter.init({
                    middlewares: {
                        checkFoo: function(req,res,next) { next();}
                    },
                    defaultMiddlewares: [
                        function(req,res,next) {
                            next();
                        }
                    ]
                })
            }).to.throw("Missing properties [controllers/controllersPath], you must specify one of them!")
    
            expect(function() {
                liteRouter.init({
                    controllers: {
                        dummy: {
                            get: function(req,res,next) {
            
                            },
                            post: function(req,res,next) {
            
                            }
                        }
                    }
                })
            }).to.throw("Missing properties [middlewares/middlewaresPath], you must specify one of them!")
    
        });
        
        it("Should be able to detect publish routes",function() {
            return route.publishRoutes([ "foo" ]).should.be.rejectedWith("Route definition Object foo  is not valid");
        });
    
        it("Should be able to detect errors on actions",function() {
            return route.publishRoutes([
                {
                    httpVerb:"get",
                    route:"/dummy",
                    action:"dummy?bad",
                    middlewares: [
                        "checkFoo"
                    ]
                }
            ]).should.be.rejectedWith("Action method bad does not exists check your route definition dummy?bad");
        });

        it("Should be able to detect errors on controller",function() {
            return route.publishRoutes([
                {
                    httpVerb:"get",
                    route:"/dummy",
                    action:"bad?good",
                    middlewares: [
                        "checkFoo"
                    ]
                }
            ]).should.be.rejectedWith("Controller bad is not defined check your route definition bad?good");
        });

        it("Should be able to detect errors on middlewares",function() {
            return route.publishRoutes([
                    {
                        httpVerb:"get",
                        route:"/dummy",
                        action:"bad?good",
                        middlewares: [
                            {}
                        ]
                    }
            ]).should.be.rejectedWith("Middleware not valid")
        });
    
    }
}