//var Project = require("./../models/Project.js");

exports.createProject = createProject;

exports.create = function(req, res){
    var project = {};
    project.project_name = req.body.project_name;
    var organization_name = req.session.organization_name;
    if(organization_name === undefined) {
        organization_name = "MappedIn";
    }
    project.organization_name = organization_name;
    project.dateCreated = Date.Now();

    createProject(project, function(err, projectName) {
        if(err) {
            console.log("Error: ", err);
        } else {
            res.redirect("/app/manage/projects");
        }
    });
};

exports.getProjectsByOrganization = function(req, res) {
    var organization_name = req.session.organization_name;
    Project.findAllInOrganization(organization_name, function(err, projects) {
        res.json({projects: projects});
    });
};

function createProject(project, callback) {
    Project.addProject(project, function(err, projectName) {
        if(err) {
            console.log("****************Error", err);
            callback(err);
        } else {
            callback(null, projectName);
        }
    });
}