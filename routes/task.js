var Task = require("./../models/Task.js");

exports.createTask = createTask;
exports.changeTask = changeTask;

exports.create = function(data, callback){
    var task = {
        name: data.name,
        description: data.description,
        project_id: data.project_id,
        due_date: data.due_date,
        time_estimate: data.time_estimate,
        status: data.status,
        owner_id: data.owner_id,
        dateCreated: new Date()
    };
    createTask(task, function(err, task) {
        if(err) {
            console.log("****************Error", err);
            callback(err);
        } else {
            callback(null, task);
        }
    });
};

exports.findAllInOrganization = function(req, res) {
    var organization_name = req.session.organization_name;
    Task.Find(organization_name, function(err, tasks) {
        res.json({tasks: tasks});
    });
};

function createTask (newtask, callback) {
    Task.addTask(newtask, function(err, task){
        if(err) {
            callback(err);
        } else {
            callback(null, task);
        }
    });
}

function changeTask (newtask, callback) {
    Task.updateTask(newtask.id, newtask, function(err, task) {
        if(err) {
            callback(err);
        } else {
            callback(null, task);
        }
    });
}