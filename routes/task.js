var Task = require("./../models/Task.js");

exports.create = function(data, callback){
	var task = {
		name: data.name,
		description: data.description,
		project_id: data.project_id,
		due_date: data.due_date,
		time_estimate: data.time_estimate,
		status: data.status,
		owner_id: data.owner_id,
		dateCreated: new Date()
	};
	Task.addTask(task, function(err, task){
		if(err) {
			callback(err);
		} else {
			Task.findByOwnersId(data.owner_id, function(err, tasks) {
				callback(null, tasks);
			});
		}
	});
};

exports.remove = function (task, callback) {
	Task.deleteTask(task.id, function(err, t) {
		if(err) {
			console.log("****************Error", err);
			callback(err);
		} else {
			Task.findByOwnersId(task.owner_id, function(err, tasks) {
				callback(null, tasks);
			});
		}
	});
};

exports.getAllTasks = function (userId, callback) {
	Task.findByOwnersId(userId, function(err, tasks) {
		callback(null, tasks);
	});
};