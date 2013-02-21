var Task = require("./../models/Task.js");

exports.create = function(req, res){
    var task = {};
    var delegates = req.body.delegates;
    task.project_name = req.body.project_name;
    task.task_name = req.body.task_name;
    task.organization_name = req.session.organization_name;
    task.time_estimate = req.body.time_estimate;
    task.priority = req.body.priority;
    task.status = req.body.status;
    task.notes = req.body.notes;
    task.delegatesArray = [];
    
    if(typeof delegates == "string") {
        delegatesArray.push(delegates);
    } else {
        delegatesArray = delegates;
    }
    createTask(task, function(err, task) {
        if(err) {
            console.log("Error: ", err);
        } else {
            res.redirect("/app/manage/projects");
        }
    });
};

exports.setTask = function(req, res) {
    var task = req.body.task;
    console.log(task);
    Task.setTask(task, function(err, task) {
        if(task !== null && task !== undefined) {
            res.json({status: "success"});
        }
    });
};

exports.getTasksByOrganization = function(req, res) {
    var organization_name = req.session.organization_name;
    Task.getTasksByOrganization(organization_name, function(err, tasks) {
        res.json({tasks: tasks});
    });
};

exports.createTask = function(task, callback) {
    Task.addTask(task.project_name, task.organization_name, task.delegatesArray, task.task_name, task.time_estimate, task.priority, task.status, task.notes, function(err, task){
        if(err) {
            callback.call(err);
        } else {
            callback.call(null, task);
        }
        //res.redirect("/app/manage/projects");
        //res.json({status: "success"});
    });
}