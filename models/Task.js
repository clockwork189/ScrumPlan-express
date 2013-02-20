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

function addTask(project_name, organization_name, delegates, task_name, time_estimate, priority, status, notes, callback) {
    var instance = new Task();
    instance.project_name = project_name;
    instance.delegates = delegates;
    instance.organization_name = organization_name;
    instance.task_name = task_name;
    instance.time_estimate = time_estimate;
    instance.priority = priority;
    instance.status = status;
    instance.notes = notes;
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
    Task.findByIdAndUpdate(task.id, { $set: {
        project_name: task.project_name,
        status: task.status,
        task_name: task.name,
        delegates: task.delegates,
        time_estimate: task.time_estimate,
        priority: task.priority,
        notes: task.notes,
        organization_name: task.organization_name
    }}, function (err, newTask) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(newTask);
            callback(null, newTask);
        }
    });
}