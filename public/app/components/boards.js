var Boards = function () {
	var self = {};

	self.init = function () {

	};

	self.create = function (board) {
		//console.log(org);
		socket.emit("create_board", board);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function () {

	};

	return self;
};