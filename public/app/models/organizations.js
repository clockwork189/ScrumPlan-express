var Org = Backbone.Models.extend({
	defaults: {
		name: "",
		dateCreated: (function () {
			return new Date();
		})(),
		projects: []
	}
});