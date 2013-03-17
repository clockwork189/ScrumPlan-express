var Projects = function () {
	var self = {};

	self.init = function () {

	};

	self.create = function (project) {
		//console.log(org);
		socket.emit("create_project", project);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function () {

	};

	return self;
};