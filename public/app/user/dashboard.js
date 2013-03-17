var Dashboard = function () {
	var self = {};
	var orgs = new Organizations();
	var boards = new Boards();
	var projects = new Projects();
	var mid = $("input[name=mid]").val();

	self.init = function () {
		initializeOrganizationActions();
		initializeCreateBoard();
		initializeCreateProject();
		initializeCreateChecklist();
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
			var div = $(".new.organization");
			var textDiv = $("input[name=organization_name]", div);
			mid = $("input[name=mid]").val();
			var orgName = textDiv.val();
			if(validateText(orgName, textDiv, "Please Enter a Name for your organization")) {
				orgs.create({name: orgName, owner_id: mid });
				hideEdit();
			}
		});
	};

	var initializeCreateBoard = function () {
		$(".organization_select").chosen();
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

		$(".new.board .create").click(function () {
			var div = $(".new.board");
			var boardName = $("input[name=board_name]",div).val();
			var organization = $("select[name=organization]",div).val();
			var isPrivate = ( $("input[name=is_private]",div).is(":checked") ? true : false);
			if(validateText(boardName, div, "Please Enter a Name for your Board")) {
				boards.create({name: boardName, organization: organization, isPrivate: isPrivate, owner_id: mid });
				hideEdit();
			}
		});
	};

	var initializeCreateProject = function () {
		$(".board_select").chosen();
		var hideEdit = function () {
			$(".empty.project").show();
			$(".new.project").hide();
			$("small.error").remove();
			$("input[name=project_name]").removeClass("error");
		};

		$(".create_project").click(function() {
			$(".empty.project").hide();
			$(".new.project").show();
		});

		$(".new.project .cancel").click(function () {
			hideEdit();
		});

		$(".new.project .create").click(function () {
			var div = $(".new.project");
			var projectName = $("input[name=project_name]", div).val();
			var board = $("select[name=board_name]",div).val();

			if(validateText(projectName, div, "Please Enter a Name for your Project")) {
				projects.create({ name: projectName, board: board, owner_id: mid });
				hideEdit();
			}
		});
	};

	var initializeCreateChecklist = function () {
		$(".board_select").chosen();
		var hideEdit = function () {
			$(".empty.project").show();
			$(".new.project").hide();
			$("small.error").remove();
			$("input[name=project_name]").removeClass("error");
		};

		$(".create_project").click(function() {
			$(".empty.project").hide();
			$(".new.project").show();
		});

		$(".new.project .cancel").click(function () {
			hideEdit();
		});

		$(".new.project .create").click(function () {
			var div = $(".new.project");
			var projectName = $("input[name=project_name]", div).val();
			var board = $("select[name=board_name]",div).val();

			if(validateText(projectName, div, "Please Enter a Name for your Project")) {
				projects.create({ name: projectName, board: board, owner_id: mid });
				hideEdit();
			}
		});
	};

	var validateText = function (text, div, message) {
		if(text.length <= 0) {
			div.addClass("error");
			if(div.parent().find("small.error").length <= 0) {
				div.parent().append("<small class='error'>" + message + "</small>");
			}
			return false;
		} else {
			return true;
		}
	};

	return self;
};

$(function() {
	var dasboard = new Dashboard();
	dasboard.init();
});