var db = require("../lib/db");

var UserSchema = new db.Schema({
	firstname: {type: String, unique: false},
	lastname: {type: String, unique: false},
	email: {type:String, unique: false},
	organization_name: String,
	github_username: String,
	twitter_id: String,
	salt: String,
	hash: String,
	date_created: Date
});

var User = db.mongoose.model("User", UserSchema);

module.exports.addUser = addUser;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getAllUsers = getAllUsers;

function addUser(firstname, lastname, email, organization_name, user_salt, user_hash, callback) {
	var instance = new User();
	instance.firstname = firstname;
	instance.lastname = lastname;
	instance.email = email;
	instance.organization_name = organization_name;
	instance.hash = user_hash;
	instance.salt = user_salt;
	instance.date_created = Date.now();
	instance.save(function (err) {
		if (err) {
			console.log("Error:", err);
			callback(err);
		} else {
			console.log(instance);
			callback(null, instance);
		}
	});
}

function getUserByEmail(email, callback) {
	User.findOne({email: email}, function (err, person) {
		if(err) {
			callback(err);
		} else {
			callback(null, person);
		}
	});
}

function getAllUsers(callback) {
    User.find(function (err, users) {
        if(err) {
            callback(err);
        } else {
            callback(null, users);
        }
    });
}