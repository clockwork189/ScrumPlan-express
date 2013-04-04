var Organization = require("./../models/Organization.js");
var Project = require("./../models/Project.js");
var Task = require("./../models/Task.js");

exports.getAllUsersOrganizationsAndProjects = function (userId, callback) {
	getAllOrganizationsAndProjects(userId, callback);
};

exports.create = function (data, callback) {
	var newOrganization = {
		name: data.name,
		members: [],
		owner_id: data.owner_id,
		dateCreated: new Date()
	};
	newOrganization.members.push(data.owner_id);
	Organization.addOrganization(newOrganization, function(err, org) {
		if(err) {
			console.log("****************Error", err);
			callback(err);
		} else {
			getAllOrganizationsAndProjects(data.owner_id, callback);
		}
	});
};

exports.remove = function (org, callback) {
	Organization.deleteOrganization(org.id, function (err, organization) {
		Project.deleteProjectsInOrganization(org.id, function (err, projects) {
			Task.deleteTasksInOrganization(org.id, function (err, tasks) {
				if(err) {
					console.log("****************Error", err);
					callback(err);
				} else {
					getAllOrganizationsAndProjects(org.owner_id, callback);
				}
			});
		});
	});
};

exports.getAllOrganizations = function (userId, callback) {
	Organization.findByOwnersId(userId, function(err, organizations) {
		callback(null, organizations);
	});
};

var getAllOrganizationsAndProjects = function (userId, callback) {
	Organization.findByOwnersId(userId, function(err, organizations) {
		Project.findByOwnersId(userId, function(err, projects) {
			Task.findByOwnersId(userId, function(err, tasks) {
				var orgObj = {};
				for(var i = 0; i < organizations.length; i ++) {
					orgObj[organizations[i]._id] = {};
					orgObj[organizations[i]._id].name = organizations[i].name;
					orgObj[organizations[i]._id]._id = organizations[i]._id;
					orgObj[organizations[i]._id].projects = [];
				}

				for(var n = 0; n < projects.length; n ++) {
					projects[n].tasks = [];
					if(orgObj.hasOwnProperty(projects[n].organization_id)) {
						for(var k = 0; k < tasks.length; k++) {
							if(tasks[k].project_id == projects[n]._id) {
								projects[n].tasks.push(tasks[k]);
							}
						}
						orgObj[projects[n].organization_id].projects.push(projects[n]);
					}
				}
				callback(null, orgObj);
			});
		});
	});
};