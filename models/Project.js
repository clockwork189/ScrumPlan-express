var db = require("../lib/db");

var ProjectSchema = new db.Schema({
    project_name: String,
    organization_name: String,
    date_created: Date
});

var Project = db.mongoose.model("Project", ProjectSchema);

module.exports.addProject = addProject;
module.exports.getAllProjects = getAllProjects;

function addProject(project_name, organization_name, callback) {
    var instance = new Project();
    instance.project_name = project_name;
    instance.organization_name = organization_name;
    instance.date_created = Date.now();
    instance.save(function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, instance);
        }
    });
}

function getAllProjects(callback) {
    Project.find(function (err, projects) {
        if(err) {
            callback(err);
        } else {
            callback(null, projects);
        }
    });
}

