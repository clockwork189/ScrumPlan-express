var Project = require("./../models/Project.js");

exports.create = function(req, res){
    var project_name = req.body.project_name;
    Project.addProject(project_name, function(err, projectName) {
        res.redirect("/app/manage/projects");
    });
};