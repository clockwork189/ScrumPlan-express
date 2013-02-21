var db = require("../lib/db");

var TaskSchema = new db.Schema({
    project_name: String,
    organization_name: String,
    delegates: Array,
    task_name: String,
    time_estimate: String,
    priority: String,
    status: String,
    notes: String,
    date_created: Date
});

var Task = db.mongoose.model("Tasks", TaskSchema);

module.exports.addTask = addTask;
module.exports.getTasksByOrganization = getTasksByOrganization;
module.exports.setTask = setTask;

function addTask(task, callback) {
    var instance = new Task();
    instance.project_name = task.project_name;
    instance.delegates = task.delegates;
    instance.organization_name = task.organization_name;
    instance.task_name = task.task_name;
    instance.time_estimate = task.time_estimate;
    instance.priority = task.priority;
    instance.status = task.status;
    instance.notes = task.notes;
    instance.date_created = Date.now();

    instance.save(function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, instance);
        }
    });
}

function getTasksByOrganization(organization_name, callback) {
    Task.find({organization_name: organization_name}, function (err, tasks) {
        if(err) {
            callback(err);
        } else {
            callback(null, tasks);
        }
    });
}

function setTask (task, callback) {
    //Task.find({task})
    console.log(task);
    // Task.findById(task.id, function(err, task) {
    //     if (err) {
    //         console.log("%&%&%&EROR", err);
    //     } else {
    //         console.log("SUCCESS!!!", task);
    //     }
    // });
    Task.findByIdAndUpdate(task.id, {
        project_name: task.project_name,
        status: task.status,
        task_name: task.name,
        delegates: task.delegates,
        time_estimate: task.time_estimate,
        priority: task.priority,
        notes: task.notes,
        organization_name: task.organization_name
    }, function (err, newTask) {
        if (err) {
            callback(err);
        } else {
            callback(null, newTask);
        }
    });
}