var Dashboard = function () {
	var self = {};
	var orgs = new Organizations();
	var projects = new Projects();
	var tasks = new Tasks();
	var mid = $("input[name=mid]").val();

	self.init = function () {
		orgs.init(mid);
		projects.init(mid);
		reload();
		initializeCreateTask();
		initializeCreateChecklist();
	};


	var reload = function () {
		orgs.reload(function (err, data) {
			if(err) {
				console.log(err);
			}
			drawOrganizations(data);
		});
		projects.reload(function (err, data) {
			if(err) {
				console.log(err);
			}
			drawProjects(data);
		});
	};

	var drawOrganizations = function (data) {
		if(data) {
			var tpl = swig.compile(data.html)({organizations: data.organizations});
			$(".dashboard.organization").html(tpl);
			initializeOrganizationActions();
		}
	};

	var drawProjects = function (data) {
		if(data) {
			var tpl = swig.compile(data.html)({projects: data.projects});
			$(".dashboard.project").html(tpl);
			initializeCreateProject();
		}
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

		$(".organization.display .delete").click(function () {
			var orgId = $(this).data("org-id");
			orgs.destroy({id: orgId, owner_id: mid});
		});
	};

	var initializeCreateProject = function () {
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
				projects.create({ name: projectName, owner_id: mid });
				hideEdit();
			}
		});

		$(".project.display .delete").click(function () {
			var projectId = $(this).data("project-id");
			projects.destroy({id: projectId, owner_id: mid});
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

			if(validateText(projectName, div, "Please Enter a Name for your Project")) {
				projects.create({ name: projectName, owner_id: mid });
				hideEdit();
			}
		});
	};

	var initializeCreateTask = function () {
		var emptyInputs = function () {
			$("input[name='task_name']").val("");
			$("input[name='project_id']").val("");
			$("input[name='dueDate']").val("");
			$("input[name='timeEstimate']").val("");
			$("textarea[name='description']").val("");
		};
		$("a.add_task").click(function (e) {
			$('#createTask').foundation('reveal', 'open');
			$('#createTask input[name="project_id"]').val($(this).data("project-id"));
			$('input[name="dueDate"]').datepicker({minDate: new Date()});
			$("select[name='user_select']").chosen();
		});

		$("button.create").click(function (e) {
			var div = $("#createTask");
			var task_name = $("input[name='task_name']").val();
			var project_id = $("input[name='project_id']").val();
			var due_date = $("input[name='dueDate']").val();
			var time_estimate = $("input[name='timeEstimate']").val();
			var status = $("select[name='user_select']").val();
			var description = $("textarea[name='description']").val();

			//if(validateText(task_name, div, "Please Enter a Name for your Task")) {
				tasks.create({name: task_name, description: description, project_id: project_id, due_date: due_date, time_estimate: time_estimate, status: status, owner_id: mid});
				emptyInputs();
				$('#createTask').foundation('reveal', 'close');
				//console.log({name: task_name, project_id: project_id, due_date: due_date, time_estimate: time_estimate, status: status});
			//}
		});

		$("button.cancel").click(function (e) {
			emptyInputs();
			$('#createTask').foundation('reveal', 'close');
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