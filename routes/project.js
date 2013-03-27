var Project = require("./../models/Project.js");
var User = require("./../models/User.js");

exports.create = function (data, callback) {

	var newProject = {
		name: data.name,
		owner_id: data.owner_id,
		dateCreated: new Date()
	};

	Project.addProject(newProject, function(err, project) {
		if(err) {
            console.log("****************Error", err);
            callback(err);
        } else {
			Project.findByOwnersId(data.owner_id, function(err, projects) {
				callback(null, projects);
			});
        }
	});
};


exports.remove = function (proj, callback) {
	Project.deleteProject(proj.id, function(err, organization) {
		if(err) {
			console.log("****************Error", err);
			callback(err);
		} else {
			Project.findByOwnersId(proj.owner_id, function(err, projects) {
				callback(null, projects);
			});
		}
	});
};

exports.getAllProjects = function (userId, callback) {
	Project.findByOwnersId(userId, function(err, projects) {
		callback(null, projects);
	});
};