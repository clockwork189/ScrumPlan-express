var Dashboard = function () {
	var self = {};
	var orgs = new Organizations();

	self.init = function () {
		initializeOrganizationActions();
		initializeCreateBoard();
		initializeCreateProject();
		initializeCreateTask();
		getGravatar();
	};

	var initializeOrganizationActions = function () {
		var hideEdit = function () {
			$(".organization.display").show();
			$(".new.organization").hide();
			$("small.error").remove();
			$("input[name=organization_name]").removeClass("error");
		};

		$(".create_organization").click(function() {
			$(".organization.display").hide();
			$(".new.organization").show();
		});

		$(".new.organization .cancel").click(function () {
			hideEdit();
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
				hideEdit();
			}
		});
	};

	var initializeCreateBoard = function () {
		var hideEdit = function () {
			$(".empty.board").show();
			$(".new.board").hide();
			$("small.error").remove();
			$("input[name=board_name]").removeClass("error");
		};

		$(".create_board").click(function() {
			$(".empty.board").hide();
			$(".new.board").show();
		});

		$(".new.board .cancel").click(function () {
			hideEdit();
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

	var getGravatar = function () {

	};

	return self;
};

$(function() {
	var dasboard = new Dashboard();
	dasboard.init();
});