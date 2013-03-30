var SPMongo = require("../lib/db");

// var db = require("../lib/db");

// var TaskSchema = new db.Schema({
//     project_name: String,
//     organization_name: String,
//     delegates: Array,
//     task_name: String,
//     time_estimate: String,
//     priority: String,
//     status: String,
//     notes: String,
//     date_created: Date
// });

// Native Driver
exports.findById = function(id, callback) {
	console.log('Retrieving tasks: ' + id);
	openDb(function(err, db) {
		db.collection('tasks', function(err, collection) {
			collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, task) {
				if(err) {
					callback(err);
				} else {
					callback(null, task);
				}
			});
		});
	});
};


exports.findByProjectId = function(project_id, callback) {
	console.log('Retrieving all tasks in project name: ' + project_id);
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.find({'project_id': project_id}).toArray(function(err, tasks) {
			if(err) {
				callback(err);
			} else {
				callback(null, tasks);
			}
		});
	});
};

exports.findByOwnersId = function(owner_id, callback) {
	console.log('Retrieving tasks: ' + owner_id);
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.find({'owner_id':owner_id}).toArray(function(err, tasks) {
			if(err) {
				callback(err);
			} else {
				callback(null, tasks);
			}
		});
	});
};

exports.findAllInOrganization = function(organization_name, callback) {
	console.log('Retrieving tasks by organization name: ' + organization_name);
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.find({'organization_name':organization_name}).toArray(function(err, users) {
			if(err) {
				callback(err);
			} else {
				callback(null, users);
			}
		});
	});
};

exports.findAll = function(callback) {
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.find().toArray(function(err, tasks) {
			if(err) {
				callback(err);
			} else {
				callback(null, tasks);
			}
		});
	});
};

exports.addTask = function(task, callback) {
	console.log('Adding task: ' + JSON.stringify(task));
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.insert(task, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.updateTask = function(id, task, callback) {
	console.log('Updating task: ' + id);
	console.log(JSON.stringify(task));
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.update({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, {$set: task}, {w:1}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				console.log("Le Resut: ", result);
				callback(null, result);
			}
		});
	});
};

exports.deleteTask = function(id, callback) {
	console.log('Deleting task: ' + id);
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.remove({'_id':task.id}, {w:1}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.deleteTasksInOrganization = function(orgid, callback) {
	console.log('Deleting tasks in organization: ' + orgid);
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.remove({'organization_id': orgid}, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.deleteTasksInProject = function(projid, callback) {
	console.log('Deleting tasks in Project: ' + projid);
	SPMongo.db.collection('tasks', function(err, collection) {
		collection.remove({'project_id': projid}, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};
