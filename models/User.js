var db = require("../lib/db");

var UserSchema = new db.Schema({
	firstname: String,
	lastname: String,
	email: {type:String, unique: true},
	github_username: String,
	twitter_id: String,
	salt: String,
	hash: String,
	date_created: Date
});

var User = db.mongoose.model("User", UserSchema);

module.exports.addUser = addUser;
module.exports.getUser = getUser;
module.exports.getUserByEmail = getUserByEmail;
module.exports.checkIfUserExists = checkIfUserExists;
module.exports.userLogin = userLogin;

function addUser(firstname, lastname, email, user_salt, user_hash, callback) {
	var instance = new User();
	instance.firstname = firstname;
	instance.lastname = lastname;
	instance.email = email;
	instance.hash = user_hash;
	instance.salt = user_salt;
	instance.date_created = Date.now();
	instance.save(function (err) {
		if (err) {
			callback(err);
		} else {
			callback(null, instance);
		}
	});
}

function userLogin(username, password, callback) {
	User.find({username: username, password: password}, function (err, person) {
		if(err) {
			console.log("Error:", err);
		} else {
			callback(person);
		}
	});
}

function getUser(username, callback) {
	User.find({username: username}, function (err, person) {
		if(err) {
			console.log("Error:", err);
		} else {
			callback(person);
		}
	});
}

function getUserByEmail(email, callback) {
	User.find({email: email}, function (err, person) {
		if(err) {
			console.log("Error:", err);
		} else {
			callback(person);
		}
	});
}


function checkIfUserExists(username) {

}

