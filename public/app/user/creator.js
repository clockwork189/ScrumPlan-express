var Creator = function () {
	var self = {};
	var projects = new Projects();
	var tasks = new Tasks();
	var mid = $("input[name=mid]").val();

	self.initializeCreateActions = function () {
		var initTaskCreate = function () {
			var emptyInputs = function () {
				$("input[name='task_name']").val("");
				$("input[name='project_id']").val("");
				$("input[name='dueDate']").val("");
				$("input[name='timeEstimate']").val("");
				$("textarea[name='description']").val("");
			};

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

		var initProjectCreate = function () {
			var clearInput = function () {
				$("input[name=project_name]").val("");
				$("#createProject").foundation("reveal", "close");
			};
			$("#createProject .create").click(function () {
				var project_name = $("input[name=project_name]").val();
				var organization_id = $("#createProject input[name=organization_id]").val();
				projects.create({ name: project_name, owner_id: mid, organization_id: organization_id });
				clearInput();
			});

			$("#createProject .cancel").click(function () {
				clearInput();
			});
		};

		initTaskCreate();
		initProjectCreate();
	};

	return self;
};