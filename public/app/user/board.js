$(function() {
	var board = new Board();
	board.init();
});

var Board = function() {
	var self = {};
	var table_div = ".scrum-board";
	var status_object = {
		"Good to have": "good_to_have",
		"Not Important": "not_important",
		"Important": "important",
		"Very Important": "very_important",
		"Urgent": "urgent"
	};

	var task_status = {
		"1": "todo",
		"2": "inprogress",
		"3": "verify",
		"4": "done"
	};
	self.init = function () {
		initForm();
		drawScrumBoard(table_div);
		initiateDraggability($(table_div));
		handleCreateTask();
		handleCreateProject();
		reload();
	};

	var initiateDraggability = function (container) {
		container.find('td').not('.project-title').sortable({
			connectWith: container.find('td').not('.project-title'),
			receive: function(event, ui) {
				moveTask(ui.item, $(this));
			}
		}).disableSelection();
		// moveTask( ui.draggable, $(this) );

		var moveTask = function (element, container) {
			var taskName = $(element).data('task');
			var newStatus = container.data("status");
			var newProject = container.parent('tr').data('project');

			var oldStatus, oldProject;
			var task = {};
			for(var i in boardObject) {
				if(boardObject[i].hasOwnProperty("tasks")) {
					for(var n = 0; n < boardObject[i].tasks.length; n++) {
						if(boardObject[i].tasks[n].name === taskName) {
							oldStatus = task.status;
							oldProject = task.project_name;
							task = boardObject[i].tasks[n];
							task.project_name = newProject;
							task.status = newStatus;
						}
					}
				}
			}

			if(!jQuery.isEmptyObject(task)) {
				console.log(newStatus, "   ", task.status);
				console.log(newProject, "   ", task.project_name);
				if(oldStatus !== task.status || oldProject !== task.project_name) {
					setTask(task);
				}
			}
		};
	};

	var setTask = function (newtask) {
		console.log("New Task Will Be: ", newtask);
		socket.emit('change_task', { task: newtask });
	};

	var initForm = function () {
		$(".project_select").chosen();
		$(".user_select").chosen();
		$(".status_select").chosen();
		$(".priority_select").chosen();

		$("#new_project").click(function() {
			$("#create_project").reveal();
		});
		$("#new_task").click(function() {
			$("#create_task").reveal();
		});
	};

	var drawScrumBoard = function (table_div) {
		$(table_div).children().remove();
		for(var i in boardObject) {
			var tr = $("<tr />").addClass('project').data('project', i);
			$("<td />").text(i).addClass('project-title').appendTo(tr);

			getTodoTasks(boardObject[i], i).appendTo(tr);
			getInProgressTasks(boardObject[i], i).appendTo(tr);
			getVerifyTasks(boardObject[i], i).appendTo(tr);
			getDoneTasks(boardObject[i], i).appendTo(tr);
			tr.appendTo(table_div);
		}
	};

	var getTodoTasks = function (project, project_name) {
		var td = $("<td />");
		if(project.tasks.length > 0) {
			for(var i = 0; i < project.tasks.length; i++) {
				var task = project.tasks[i];
				if(task.status === "1") {
					var div = createTaskDiv(task, task.priority, project_name, task_status[task.status]);
					div.appendTo(td);
				}
			}
		}
		td.data("status", "1");
		return td;
	};

	var getInProgressTasks = function (project, project_name) {
		var td = $("<td />");
		if(project.tasks.length > 0) {
			for(var i = 0; i < project.tasks.length; i++) {
				var task = project.tasks[i];
				if(task.status === "2") {
					var div = createTaskDiv(task, task.priority, project_name, task_status[task.status]);
					div.appendTo(td);
					td.data("status", task.status);
				}
			}
		}
		td.data("status", "2");
		return td;
	};

	var getVerifyTasks = function (project, project_name) {
		var td = $("<td />");
		if(project.tasks.length > 0) {
			for(var i = 0; i < project.tasks.length; i++) {
				var task = project.tasks[i];
				if(task.status === "3") {
					var div = createTaskDiv(task, task.priority, project_name, task_status[task.status]);
					div.appendTo(td);
					td.data("status", task.status);
				}
			}
		}
		td.data("status", "3");
		return td;
	};

	var getDoneTasks = function (project, project_name) {
		var td = $("<td />");
		if(project.tasks.length > 0) {
			for(var i = 0; i < project.tasks.length; i++) {
				var task = project.tasks[i];
				if(task.status === "4") {
					var div = createTaskDiv(task, task.priority, project_name, task_status[task.status]);
					div.appendTo(td);
					td.data("status", task.status);
				}
			}
		}
		td.data("status", "4");
		return td;
	};

	var createTaskDiv = function (task, priority, project_name, task_status) {
		var div = $("<div />").addClass('task task-box ')
							.text(task.name)
							.attr("data-project_name", project_name)
							.attr("data-task_status", task_status)
							.data('task', task.name);
		div.append("<br/>");
		$("<small />").text(task.delegates).appendTo(div);

		return div;
	};

	var handleCreateTask = function () {
		$("form.task-creation").submit(function() {
			socket.emit('add_task', $(this).serializeFormJSON());
			addProject($(this).serializeFormJSON());
			return false;
		});
	};

	var handleCreateProject = function () {
		$("form.project-creation").submit(function() {
			var project = $(this).serializeFormJSON();
			socket.emit('add_project', $(this).serializeFormJSON());
			return false;
		});
	};

	var addProject = function (project) {
		var tr = $("<tr />").addClass('project').data('project', project.project_name);
		var i = 0;
		$("<td />").text(project.project_name).addClass('project-title').appendTo(tr);
		while(i < 3) {
			$("<td />").appendTo(tr);
			i++;
		}
		tr.appendTo(table_div);
	};

	var reload = function () {
		socket.on("reload", function (board) {
			var boardObj = {};
			var projects = board.projects;
			var tasks = board.tasks;

			for(var i in projects) {
				var project_name = projects[i].project_name;
				boardObj[project_name] = {};
				boardObj[project_name].tasks = [];
			}
			for(var n in tasks) {
				var proj_name = tasks[n].project_name;
				var taskObj = {};
				taskObj.id = tasks[n]._id;
				taskObj.project_name = proj_name;
				taskObj.name = tasks[n].task_name;
				taskObj.status = tasks[n].status;
				taskObj.delegates = tasks[n].delegates;
				taskObj.notes = tasks[n].notes;
				taskObj.time_estimate = tasks[n].time_estimate;
				taskObj.organization_name = tasks[n].organization_name;
				taskObj.priority = tasks[n].priority;

				boardObj[proj_name].tasks.push(taskObj);
			}
			boardObject = boardObj;
			console.log(boardObj);
		});
	};

	return self;
};