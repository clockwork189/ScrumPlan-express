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

function addTask(project_name, organization_name, delegates, task_name, time_estimate, priority, status_select, notes, callback) {
    var instance = new Task();
    instance.project_name = project_name;
    instance.delegates = delegates;
    instance.organization_name = organization_name;
    instance.task_name = task_name;
    instance.time_estimate = time_estimate;
    instance.priority = priority;
    instance.status = status_select;
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