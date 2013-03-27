var Organization = require("./../models/Organization.js");
var User = require("./../models/User.js");

exports.create = function (data, callback) {
	var newOrganization = {
		name: data.name,
		members: [],
		owner_id: data.owner_id,
		dateCreated: new Date()
	};
	newOrganization.members.push(data.owner_id);
	Organization.addOrganization(newOrganization, function(err, org) {
		if(err) {
			console.log("****************Error", err);
			callback(err);
		} else {
			Organization.findByOwnersId(data.owner_id, function(err, organizations) {
				callback(null, organizations);
			});
		}
	});
};

exports.remove = function (org, callback) {
	Organization.deleteOrganization(org.id, function(err, organization) {
		if(err) {
			console.log("****************Error", err);
			callback(err);
		} else {
			Organization.findByOwnersId(org.owner_id, function(err, organizations) {
				callback(null, organizations);
			});
		}
	});
};

exports.getAllOrganizations = function (userId, callback) {
	Organization.findByOwnersId(userId, function(err, organizations) {
		callback(null, organizations);
	});
};