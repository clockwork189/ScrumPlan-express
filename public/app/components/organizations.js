var Organizations = function () {
	var self = {};

	self.init = function (userId) {
		socket.emit("request-reload-organizations", {user: userId});
	};

	self.reload = function (callback) {
		socket.on("reload-organizations", function (data) {
			callback(null, data);
		});
	};

	self.create = function (org) {
		//console.log(org);
		socket.emit("create_organization", org);
	};

	self.update = function () {

	};

	self.read = function () {

	};

	self.destroy = function (org) {
		socket.emit("remove_organization", org);
	};

	return self;
};