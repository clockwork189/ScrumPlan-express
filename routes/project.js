var Project = require("./../models/Project.js");
var User = require("./../models/User.js");

exports.create = function (data, callback) {

	var newProject = {
		name: data.name,
		board: data.board,
		owner_id: data.owner_id,
		dateCreated: new Date()
	};

	Project.addProject(newProject, function(err, project) {
		if(err) {
            console.log("****************Error", err);
            callback(err);
        } else {
            callback(null, project);
        }
	});
};