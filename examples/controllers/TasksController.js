"use strict"

class TasksController {
        
    constructor() {
        this.tasks = [];
    }

    findAll(req,res) {
        res.send(this.tasks)
    }

    findOne(req,res) {
        res.send(req.task);
    }

    create(req,res,next) {
        this.tasks.push(req.body);
        this.sendResponse(201,req.body,res);
    }
    
    taskExists(req,res,next) {
        let taskIdx = this.tasks.findIndex((task)=> task.id == req.params.taskId);
        if(taskIdx > -1 ) {
            let task = this.tasks[taskIdx]
            task._index = taskIdx;
            req.task = task;
            next();
        } else {
            this.sendResponse(404,"Task not found",res);
        }
    }
    /**
     * Used to send responses for restify and express
     * @param {*} statusCode 
     * @param {*} message 
     * @param {*} res 
     */
    sendResponse(statusCode,message,res) {
        let resp = res.status(statusCode)
        if(resp.send) {
            resp.send(message)
        } else {
            res.send(message)
        }
    }

    update(req,res) {
        let taskFromRequest = req.body;
        let taskFromDb      = req.task;
        let updatedTask = Object.assign(taskFromDb,taskFromRequest)
        this.tasks[taskFromDb._index] = updatedTask
        this.sendResponse(200,updatedTask,res)
    }
    
    destroy(req,res) {
        this.tasks.splice(req.task._index,1)
        this.sendResponse(200,req.task,res);
    }
}

module.exports =  new TasksController();
