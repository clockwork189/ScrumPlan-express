var Task = require("./../models/Task.js");

exports.create = function(req, res){
    var project_name = req.body.project_name;
    var delegates = req.body.delegates;
    var task_name = req.body.task_name;
    var organization_name = req.session.organization_name;
    var time_estimate = req.body.time_estimate;
    var priority = req.body.priority;
    var status = req.body.status;
    var notes = req.body.notes;
    var delegatesArray = [];
    
    if(typeof delegates == "string") {
        delegatesArray.push(delegates);
    } else {
        delegatesArray = delegates;
    }

    Task.addTask(project_name, organization_name, delegatesArray, task_name, time_estimate, priority, status, notes, function(err, task){
        res.redirect("/app/manage/projects");
        //res.json({status: "success"});
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