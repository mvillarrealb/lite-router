"use strict"

module.exports = [
    {
        httpVerb:"get",
        route:"/tasks",
        action:"TasksController?findAll",
        middlewares: [
            "visitCounter",
            (req,res,next) => {
                console.log("Just passing by :D")
                next()
            }
        ]
    },
    {
        httpVerb:"post",
        route:"/tasks",
        action:"TasksController?create",
        middlewares: [
            "visitCounter"
        ]
    },
    {
        httpVerb:"get",
        route:"/tasks/:taskId",
        action:"TasksController?findOne",
        middlewares: [
            "TasksController?taskExists",
            "visitCounter"
        ]
    },
    {
        httpVerb:"put",
        route:"/tasks/:taskId",
        action:"TasksController?update",
        middlewares: [
            "TasksController?taskExists",
            "visitCounter"
        ]
    },
    {
        httpVerb:"delete",
        route:"/tasks/:taskId",
        action:"TasksController?destroy",
        middlewares: [
            "TasksController?taskExists",
            "visitCounter"
        ]
    }
];