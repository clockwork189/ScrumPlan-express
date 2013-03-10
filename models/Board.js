var SPMongo = require("../lib/db");

// var BoardSchema = new db.Schema({
//     board_name: String,
//     board_owner_email: String,
//     date_created: Date
// });


// Native Driver
exports.openDb = function() {
	SPMongo.db.open(function(err, db) {
	if(!err) {
		console.log("Connected to ScrumPlan database");
		SPMongo.db.collection('boards', {safe:true}, function(err, collection) {
			if (err) {
				console.log("The  collection doesn't exist. Creating it now...");
			}
		});
	}
	});
};

exports.findById = function(id, callback) {
	console.log('Retrieving board: ' + id);
	SPMongo.db.collection('boards', function(err, collection) {
		collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, board) {
			if(err) {
				callback(err);
			} else {
				callback(null, board);
			}
		});
	});
};

exports.findByOwnersId = function(owner_id, callback) {
	console.log('Retrieving board: ' + owner_id);
	SPMongo.db.collection('boards', function(err, collection) {
		collection.find({'owner_id':collection.db.bson_serializer.ObjectID.createFromHexString(owner_id)}, function(err, boards) {
			if(err) {
				callback(err);
			} else {
				callback(null, boards);
			}
		});
	});
};

exports.findAll = function(callback) {
	SPMongo.db.collection('boards', function(err, collection) {
		collection.find().toArray(function(err, boards) {
			if(err) {
				callback(err);
			} else {
				callback(null, boards);
			}
		});
	});
};

exports.addBoard = function(board, callback) {
	console.log('Adding board: ' + JSON.stringify(board));
	SPMongo.db.collection('boards', function(err, collection) {
		collection.insert(board, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.addUserToBoard = function(email, board_id, callback) {
	console.log('Adding User: ' + JSON.stringify(email));
	SPMongo.db.collection('boards', function(err, collection) {
		collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(board_id)}, function(err, board) {
			if(err) {
				callback(err);
			} else {
				board.members.push(email);
				collection.update({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(board_id)}, board, {safe:true}, function(err, result) {
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

exports.updateBoard = function(id, board, callback) {
	console.log('Updating board: ' + id);
	console.log(JSON.stringify(board));
	SPMongo.db.collection('boards', function(err, collection) {
		collection.update({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, board, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};

exports.deleteBoard = function(id, callback) {
	console.log('Deleting board: ' + id);
	SPMongo.db.collection('boards', function(err, collection) {
		collection.remove({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	});
};
