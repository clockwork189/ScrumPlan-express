var SPMongo = require("../lib/db");

// var UserSchema = new db.Schema({
//  firstname: {type: String, unique: false},
//  lastname: {type: String, unique: false},
//  email: {type:String, unique: false},
//  organization_name: String,
//  github_username: String,
//  twitter_id: String,
//  salt: String,
//  hash: String,
//  date_created: Date
// });

// Native Driver

exports.findById = function(id, callback) {
    console.log('Retrieving user: ' + id);
    SPMongo.db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
            if(err) {
                callback(err);
            } else {
                callback(null, user);
            }
        });
    });
};


exports.findByEmail = function(email, callback) {
    console.log('Retrieving user by email: ' + email);
    SPMongo.db.collection('users', function(err, collection) {
        collection.findOne({'email':email}, function(err, user) {
            if(err) {
                callback(err);
            } else {
                callback(null, user);
            }
        });
    });
};

exports.findAllInOrganization = function(organization_name, callback) {
    console.log('Retrieving user by organization name: ' + organization_name);
    SPMongo.db.collection('users', function(err, collection) {
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
    SPMongo.db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, users) {
            if(err) {
                callback(err);
            } else {
                callback(null, users);
            }
        });
    });
};

exports.addUser = function(user, callback) {
    console.log('Adding user: ' + JSON.stringify(user));
    SPMongo.db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.updateUser = function(id, user, callback) {
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    SPMongo.db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.deleteUser = function(id, callback) {
    console.log('Deleting user: ' + id);
    SPMongo.db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};
