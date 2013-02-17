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
module.exports.getUserByEmail = getUserByEmail;

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

function getUserByEmail(email, callback) {
	User.findOne({email: email}, function (err, person) {
		if(err) {
			callback(err);
		} else {
			callback(null, person);
		}
	});
}

