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
exports.openDb = function() {
    SPMongo.db.open(function(err, db) {
    if(!err) {
        console.log("Connected to ScrumPlan database");
        SPMongo.db.collection('tasks', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The  collection doesn't exist. Creating it now...");
            }
        });
    }
    });
};

exports.findById = function(id, callback) {
    console.log('Retrieving tasks: ' + id);
    SPMongo.db.collection('tasks', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, task) {
            if(err) {
                callback(err);
            } else {
                callback(null, task);
            }
        });
    });
};


exports.findByProjectName = function(project_name, callback) {
    console.log('Retrieving all tasks in project name: ' + project_name);
    SPMongo.db.collection('tasks', function(err, collection) {
        collection.findOne({'project_name': project_name}, function(err, tasks) {
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
        collection.insert(user, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.updateUser = function(id, task, callback) {
    console.log('Updating task: ' + id);
    console.log(JSON.stringify(task));
    SPMongo.db.collection('tasks', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, task, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.deleteTask = function(id, callback) {
    console.log('Deleting task: ' + id);
    SPMongo.db.collection('tasks', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};
