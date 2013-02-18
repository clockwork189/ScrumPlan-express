var Task = require("./../models/Task.js");

exports.create = function(req, res){
    var project_name = req.body.project_name;
    var delegates = req.body.delegates;
    var task_name = req.body.task_name;
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

    Task.addTask(project_name, delegatesArray, task_name, time_estimate, priority, status, notes, function(err, task){
        res.redirect("/app/manage/projects");
    });

    // Project.addProject(project_name, function(err, projectName) {
    //     res.redirect("/app/manage/projects");
    // });
};