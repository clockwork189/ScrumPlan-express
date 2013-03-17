var Board = require("./../models/Board.js");
var User = require("./../models/User.js");

exports.create = function (data, callback) {

	var newBoard = {
		name: data.name,
		isPrivate: data.isPrivate,
		organization: data.organization,
		owner_id: data.owner_id,
		dateCreated: new Date()
	};

	Board.addBoard(newBoard, function(err, board) {
		if(err) {
            console.log("****************Error", err);
            callback(err);
        } else {
            callback(null, board);
        }
	});
};