var db = require("../lib/db");

// var UserSchema = new db.Schema({
// 	firstname: {type: String, unique: false},
// 	lastname: {type: String, unique: false},
// 	email: {type:String, unique: false},
// 	organization_name: String,
// 	github_username: String,
// 	twitter_id: String,
// 	salt: String,
// 	hash: String,
// 	date_created: Date
// });

// var User = db.mongoose.model("User", UserSchema);

// module.exports.addUser = addUser;
// module.exports.getUserByEmail = getUserByEmail;
// module.exports.getAllUsers = getAllUsers;
// module.exports.getUsersByOrganization = getUsersByOrganization;

// function addUser(firstname, lastname, email, organization_name, user_salt, user_hash, callback) {
// 	var instance = new User();
// 	instance.firstname = firstname;
// 	instance.lastname = lastname;
// 	instance.email = email;
// 	instance.organization_name = organization_name;
// 	instance.hash = user_hash;
// 	instance.salt = user_salt;
// 	instance.date_created = Date.now();
// 	instance.save(function (err) {
// 		if (err) {
// 			console.log("Error:", err);
// 			callback(err);
// 		} else {
// 			console.log(instance);
// 			callback(null, instance);
// 		}
// 	});
// }

// function getUserByEmail(email, callback) {
// 	User.findOne({email: email}, function (err, person) {
// 		if(err) {
// 			callback(err);
// 		} else {
// 			callback(null, person);
// 		}
// 	});
// }

// function getUsersByOrganization(organization_name, callback) {
//     User.find({organization_name: organization_name}, function (err, users) {
//         if(err) {
//             callback(err);
//         } else {
//             callback(null, users);
//         }
//     });
// }

// function getAllUsers(callback) {
//     User.find(function (err, users) {
//         if(err) {
//             callback(err);
//         } else {
//             callback(null, users);
//         }
//     });
// }

// Native Driver
exports.openDb = function() {
    db.open(function(err, db) {
    if(!err) {
        console.log("Connected to ScrumPlan database");
        db.collection('users', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The  collection doesn't exist. Creating it now...");
            }
        });
    }
    });
};

exports.findById = function(id, callback) {
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
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
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
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
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
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
    db.collection('users', function(err, collection) {
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
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.updateUser = function(id, user) {
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
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
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};
