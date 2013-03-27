var Tasks = function () {
	var self = {};

	self.init = function (userId) {
		socket.emit("request-reload-tasks", {user: userId});
	};

	self.reload = function (callback) {
		socket.on("reload-tasks", function (data) {
			callback(null, data);
		});
	};

	self.create = function (task) {
		socket.emit("create_task", task);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function (task) {
		socket.emit("remove_task", task);
	};

	return self;
};