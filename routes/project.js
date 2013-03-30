var Organization = require("./../models/Organization.js");
var Project = require("./../models/Project.js");

exports.create = function (data, callback) {

	var newProject = {
		name: data.name,
		owner_id: data.owner_id,
		organization_id: data.organization_id,
		dateCreated: new Date()
	};

	Project.addProject(newProject, function(err, project) {
		if(err) {
            console.log("****************Error", err);
            callback(err);
        } else {
			getAllOrganizationsAndProjects(data.owner_id, callback);
        }
	});
};


exports.remove = function (proj, callback) {
	Project.deleteProject(proj.id, function(err, project) {
		if(err) {
			console.log("****************Error", err);
			callback(err);
		} else {
			getAllOrganizationsAndProjects(proj.owner_id, callback);
		}
	});
};

exports.getAllProjects = function (userId, callback) {
	Project.findByOwnersId(userId, function(err, projects) {
		callback(null, projects);
	});
};


var getAllOrganizationsAndProjects = function (userId, callback) {
	Organization.findByOwnersId(userId, function(err, organizations) {
		Project.findByOwnersId(userId, function(err, projects) {
			var orgObj = {};
			for(var i = 0; i < organizations.length; i ++) {
				orgObj[organizations[i]._id] = {};
				orgObj[organizations[i]._id].name = organizations[i].name;
				orgObj[organizations[i]._id]._id = organizations[i]._id;
				orgObj[organizations[i]._id].projects = [];
			}

			for(var n = 0; n < projects.length; n ++) {
				if(orgObj.hasOwnProperty(projects[n].organization_id)) {
					orgObj[projects[n].organization_id].projects.push(projects[n]);
				}
			}
			callback(null, orgObj);
		});
	});
};