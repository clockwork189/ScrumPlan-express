var Projects = function () {
	var self = {};

	self.init = function (userId) {
		socket.emit("request-reload-projects", {user: userId});
	};

	self.reload = function (callback) {
		socket.on("reload-projects", function (data) {
			callback(null, data);
		});
	};

	self.create = function (project) {
		//console.log(org);
		socket.emit("create_project", project);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function (project) {
		socket.emit("remove_project", project);
	};

	return self;
};