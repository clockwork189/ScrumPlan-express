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
// exports.openDb = function() {
//     SPMongo.db.open(function(err, db) {
//     if(!err) {
//         console.log("Connected to ScrumPlan database");
//         SPMongo.db.collection('users', {safe:true}, function(err, collection) {
//             if (err) {
//                 console.log("The  collection doesn't exist. Creating it now...");
//             }
//         });
//     }
//     });
// };

exports.findById = function(id, callback) {
	console.log('Retrieving user: ' + id);
	SPMongo.db.collection('users', function(err, collection) {
		collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, user) {
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
		collection.findOne({'email': user.email}, function(err, usr) {
			if(usr) {
				console.log("User already added");
				callback(null, usr);
			} else {
				collection.insert(user, {safe:true}, function(err, result) {
					if(err) {
						callback(err);
					} else {
						callback(null, result);
					}
				});
			}
		});
	});
};

exports.updateUser = function(id, user, callback) {
	console.log('Updating user: ' + id);
	console.log(JSON.stringify(user));
	SPMongo.db.collection('users', function(err, collection) {
		collection.update({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, user, {safe:true}, function(err, result) {
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
		collection.remove({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};
