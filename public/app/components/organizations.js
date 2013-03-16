var Organizations = function () {
	var self = {};

	self.init = function () {

	};

	self.create = function (org) {
		//console.log(org);
		socket.emit("create_organization", org);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function () {

	};

	return self;
};