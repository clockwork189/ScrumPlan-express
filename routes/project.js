var Project = require("./../models/Project.js");

exports.create = function(req, res){
    var project_name = req.body.project_name;
    var organization_name = req.session.organization_name;
    //console.log("Project: ", project_name, "   organization_name:", organization_name);
    // Implement Redis Store Here
    if(organization_name === undefined) {
        organization_name = "MappedIn";
    }
    Project.addProject(project_name, organization_name, function(err, projectName) {
        res.redirect("/app/manage/projects");
    });
};