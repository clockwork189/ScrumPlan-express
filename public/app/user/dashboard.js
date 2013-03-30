var Dashboard = function () {
	var self = {};
	var orgs = new Organizations();
	var projects = new Projects();
	var tasks = new Tasks();
	var mid = $("input[name=mid]").val();

	self.init = function () {
		orgs.init(mid);
		projects.init(mid);
		tasks.init(mid);
		reload();
		$(".calendar").fullCalendar({
			header: {
				left:   'prev',
				center: 'title',
				right:  'next'
			}
		});
	};


	var reload = function () {
		orgs.reload(function (err, data) {
			if(err) {
				console.log(err);
			}
			drawOrganizations(data);
		});
	};

	var drawOrganizations = function (data) {
		if(data) {
			var tpl = swig.compile(data.html)({organizations: data.organizations});
			$(".dashboard .organization").html(tpl);
			initializeOrganizationActions();
			initializeProjectMethods();
			initializeTaskMethods();
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
			$(".empty.organization").hide();
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

		$(".org.delete").click(function () {
			var orgId = $(this).data("org-id");
			orgs.destroy({id: orgId, owner_id: mid});
		});
	};

	var initializeProjectMethods = function () {
		var clearInput = function () {
			$("input[name=project_name]").val("");
			$("#createProject").foundation("reveal", "close");
		};
		$("a.new_project").click(function () {
			$("#createProject").foundation("reveal", "open");
			$("#createProject input[name=organization_id]").val($(this).data("org-id"));
		});

		$("#createProject .create").click(function () {
			var project_name = $("input[name=project_name]").val();
			var organization_id = $("#createProject input[name=organization_id]").val();
			projects.create({ name: project_name, owner_id: mid, organization_id: organization_id });
			clearInput();
		});

		$("#createProject .cancel").click(function () {
			clearInput();
		});

		$(".project.delete").click(function () {
			var projectId = $(this).data("project-id");
			projects.destroy({id: projectId, owner_id: mid});
		});
	};


	var initializeTaskMethods = function () {
		var emptyInputs = function () {
			$("input[name='task_name']").val("");
			$("input[name='project_id']").val("");
			$("input[name='dueDate']").val("");
			$("input[name='timeEstimate']").val("");
			$("textarea[name='description']").val("");
		};
		$(".projects.display .add").click(function (e) {
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

		$(".task.display .delete").click(function () {
			var taskId = $(this).data("task-id");
			tasks.destroy({id: taskId, owner_id: mid});
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