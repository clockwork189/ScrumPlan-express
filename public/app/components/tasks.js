var Tasks = function () {
	var self = {};

	self.init = function () {

	};

	self.create = function (task) {
		socket.emit("create_task", task);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function () {

	};

	return self;
};