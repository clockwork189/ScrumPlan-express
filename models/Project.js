var SPMongo = require("../lib/db");

// var ProjectSchema = new db.Schema({
//     project_name: String,
//     organization_name: String,
//     date_created: Date
// });

// Native Driver
exports.findById = function(id, callback) {
	console.log('Retrieving project: ' + id);
	SPMongo.db.collection('projects', function(err, collection) {
		collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, project) {
			if(err) {
				callback(err);
			} else {
				callback(null, project);
			}
		});
	});
};

exports.findAllInOrganization = function(organization_name, callback) {
	console.log('Retrieving project by organization name: ' + organization_name);
	SPMongo.db.collection('projects', function(err, collection) {
		collection.find({'organization_name':organization_name}).toArray(function(err, projects) {
			if(err) {
				callback(err);
			} else {
				callback(null, projects);
			}
		});
	});
};

exports.findByOrganizationId = function(organization_id, callback) {
	console.log('Retrieving project by organization id: ' + organization_id);
	SPMongo.db.collection('projects', function(err, collection) {
		collection.find({'organization_id':organization_id}).toArray(function(err, projects) {
			if(err) {
				callback(err);
			} else {
				callback(null, projects);
			}
		});
	});
};

exports.findByOwnersId = function(owner_id, callback) {
	console.log('Retrieving projects: ' + owner_id);
	SPMongo.db.collection('projects', function(err, collection) {
		collection.find({'owner_id':owner_id}).toArray(function(err, projects) {
			if(err) {
				callback(err);
			} else {
				callback(null, projects);
			}
		});
	});
};

exports.findAll = function(callback) {
	SPMongo.db.collection('projects', function(err, collection) {
		collection.find().toArray(function(err, projects) {
			if(err) {
				callback(err);
			} else {
				callback(null, projects);
			}
		});
	});
};

exports.addProject = function(project, callback) {
	console.log('Adding project: ' + JSON.stringify(project));
	SPMongo.db.collection('projects', function(err, collection) {
		collection.insert(project, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.updateProject = function(id, project, callback) {
	console.log('Updating project: ' + id);
	console.log(JSON.stringify(project));
	SPMongo.db.collection('projects', function(err, collection) {
		collection.update({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, project, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.deleteProject = function(id, callback) {
	console.log('Deleting project: ' + id);
	SPMongo.db.collection('projects', function(err, collection) {
		collection.remove({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};
exports.deleteProjectsInOrganization = function(orgid, callback) {
	console.log('Deleting project in organization: ' + orgid);
	SPMongo.db.collection('projects', function(err, collection) {
		collection.remove({'organization_id': orgid}, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};
