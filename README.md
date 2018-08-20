# lite-router

Simple and flexible router publisher for express and restify

# Installation

```bash
    npm install --save lite-router
```

# Usage

## Choosing an Implementation

lite-router has a two main implementations to be chosen: **restify** and **express**, booth of them share the same api.

### Restify

To use LiteRouter in restify

```javascript

const LiteRouter = require("lite-router").restify;
const routesDefinition = require("./path_to/routes_definition.js");

let routerHandler = LiteRouter.init({
    controllers: controllers,
    middlewares: middlewares
});

routerHandler.publishRoutes(routesDefinition).then((router) => {
    //do something with the created router
});
```
---

### Express

To use LiteRouter in express

```javascript

const LiteRouter = require("lite-router").express;
const routesDefinition = require("./path_to/routes_definition.js");

let routerHandler = LiteRouter.init({
    controllers: controllers,
    middlewares: middlewares
});

routerHandler.publishRoutes(routesDefinition).then((router) => {
    //do something with the created router
});
```

Note that in booth cases LiteRouter.init method takes two parameters: *controllers* and *middlewares*, these can be an array of modules(loaded via mod-loader for example) or a string pointing to a directory.

If you specify a directory name, then liteRouter will execute **require** on the specified path so you may want to use bootstraping for controllers and middlewares.

---

## Route Definition

In order to use lite-router you have to use a route definition; a json array used to create a router with the following syntax:

```json
[
    {
        "httpVerb":"get",
        "route":"/tasks",
        "action":"TasksController?findAll",
        "middlewares": [
            "visitCounter"
        ]
    }
]
```
It also can be expressed as a javascript module

```javascript
module.exports = [
    {
        httpVerb:"get",
        route:"/tasks",
        action:"TasksController?findAll",
        middlewares: [
            "visitCounter",
            (req,res,next)=> {
                console.log("Hi there just passing by")
                next()
            }
        ]
    }
]
```

The following table show the parameters required to configure a route definition

field|description|Example
-|-|-
httpVerb|Http verb to be published in the route|get
route|Endpoint to be published|/tasks
action|ControllerName?actionName to be executed|TaskController?findAll
middlewares|List of middlewares|[ "visitCounter" ]


## actionString syntax

As you may noticed the action parameter follows a syntax like **taskController?findAll**, this is a syntax I've decided to call *actionString* is a simple way of representing class and method invocation, LiteRouter knows that you are specifying a class?method binding to a route. 

The same goes for middlewares if you specify a middleware as a string it will look for them in the middlewares object, however if LiteRouter detects actionString syntax it will try to resolve your middleware as a method from a class.

In this example we define a update action with the verb PUT for a route identified for /tasks/:task_id in the middlewares you can see two entries:

* visitCounter: A simple middleware that is going to bee looked up into middlewares object.
* TasksController?exists: An actionString specifying that TasksController has a method called exists that will be threated as a middleware for the execution stack.

```javascript
module.exports = [
    {
        httpVerb:"put",
        route:"/tasks/:task_id",
        action:"TasksController?update",
        middlewares: [
            "visitCounter",
            "TasksController?exists"
        ]
    }
]
```
For this example the TasksController will look like this:

```javascript

class TasksController {
    update(req,res) {
        //update logic
        res.send({..})
    }

    exits(req,res,next) {
        if(exits...) {
            return next()
        } else {
            return res.status(404).send(...)
        }
    }
}
```

# Running Examples

To have a clear idea of how lite-router works you have two examples for running apis with express and restify.

---

# Testing

```bash
    npm test
```
# Generating docs

```bash
    npm generate-docs
```
---

# Why lite-router

lite-router allows you to encapsulate route publishing and middleware organizing as externalized files, this enable a modular development with a fine separation of concerns for your express & restify REST Apis.
