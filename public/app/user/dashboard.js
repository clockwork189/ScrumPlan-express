var Dashboard = function () {
	var self = {};
	var orgs = new Organizations();

	self.init = function () {
		initializeOrganizationActions();
		initializeCreateBoard();
		initializeCreateProject();
		initializeCreateTask();
	};

	var initializeOrganizationActions = function () {
		$(".create_organization").click(function() {
			$(".empty.organization").hide();
			$(".new.organization").show();
		});

		$(".new.organization .cancel").click(function () {
			$(".empty.organization").show();
			$(".new.organization").hide();
			$("small.error").remove();
			$("input[name=organization_name]").removeClass("error");
		});

		$(".new.organization .create").click(function () {
			var textDiv = $("input[name=organization_name]");
			var mid = $("input[name=mid]").val();
			var orgName = textDiv.val();
			if(orgName.length <= 0) {
				textDiv.addClass("error");
				if(textDiv.parent().find("small.error").length <= 0) {
					textDiv.parent().append("<small class='error'>Please Enter a Name for your organization</small>");
				}
			} else {
				orgs.create({name: orgName, owner_id: mid });
			}
		});
	};

	var initializeCreateBoard = function () {
		$(".create_board").click(function() {

		});
	};

	var initializeCreateProject = function () {
		$(".create_project").click(function() {

		});
	};

	var initializeCreateTask = function () {
		$(".create_task").click(function() {

		});
	};

	return self;
};

$(function() {
	var dasboard = new Dashboard();
	dasboard.init();
});