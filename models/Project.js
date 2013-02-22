// var db = require("../lib/db");

// var ProjectSchema = new db.Schema({
//     project_name: String,
//     organization_name: String,
//     date_created: Date
// });

// var Project = db.mongoose.model("Project", ProjectSchema);

// module.exports.addProject = addProject;
// module.exports.getProjectsByOrganization = getProjectsByOrganization;

// function addProject(project, callback) {
//     var instance = new Project();
//     instance.project_name = project.project_name;
//     instance.organization_name = project.organization_name;
//     instance.date_created = Date.now();
//     instance.save(function (err) {
//         if (err) {
//             callback(err);
//         } else {
//             callback(null, instance);
//         }
//     });
// }

// function getProjectsByOrganization(organization_name, callback) {
//     Project.find({organization_name: organization_name}, function (err, projects) {
//         if(err) {
//             callback(err);
//         } else {
//             callback(null, projects);
//         }
//     });
// }

