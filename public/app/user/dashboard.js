var Dashboard = function () {
	var self = {};
	var orgs = new Organizations();
	var projects = new Projects();
	var tasks = new Tasks();
	var mid = $("input[name=mid]").val();
	var maker = new Creator();
	var dashboardObj = {};

	self.init = function () {
		loadTemplates();
		reload();
		$(".calendar").fullCalendar({
			header: {
				left:   'prev',
				center: 'title',
				right:  'next'
			}
		});
		maker.initializeCreateActions();
	};

	var loadTemplates = function () {
		socket.emit("req-load-dashboard-templates");
		socket.on("load-templates", function (templates) {
			for(var i = 0; i < templates.length; i++) {
				$("<script />")
					.prop({type: "text/template", id: templates[i].id})
					.html(templates[i].html)
					.appendTo($("body"));
			}
		});
	};

	var reload = function () {
		orgs.init(mid);
		socket.on("reload", function (data) {
			drawOrganizations(data);
			dashboardObj = data;
		});
	};

	var drawOrganizations = function (data) {
		if(data) {
			var template = $("#organization-template").html();
			var tpl = swig.compile(template)({organizations: data});
			$(".dashboard .organization").html(tpl);
			initializeOrganizationActions();
			initializeProjectMethods();
			initializeTaskMethods();
			setOrganizationProjectNumber(data);
		}
	};

	var setOrganizationProjectNumber = function (orgs) {
		var orgCount = 0;
		var projectCount = 0;
		for(var i in orgs) {
			orgCount++;
			projectCount += orgs[i].projects.length;
		}

		$("#org_count").text(orgCount);
		$("#projects_count").text(projectCount);
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
		$("a.new_project").click(function () {
			$("#createProject").foundation("reveal", "open");
			$("#createProject input[name=organization_id]").val($(this).data("org-id"));
		});

		$(".project.delete").click(function () {
			var projectId = $(this).data("project-id");
			projects.destroy({id: projectId, owner_id: mid});
		});
	};


	var initializeTaskMethods = function () {
		$(".projects.display .add").click(function (e) {
			$('#createTask').foundation('reveal', 'open');
			$('input[name="dueDate"]').datepicker({minDate: new Date()});
			$("select[name='user_select']").chosen();
			$("input[name='project_id']").val($(this).data("project-id"));
			$("input[name='organization_id']").val($(this).data("organization-id"));
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