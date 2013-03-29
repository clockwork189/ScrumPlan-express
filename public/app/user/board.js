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
		initiateDraggability($(table_div));
		handleCreateTask();
		handleCreateProject();
		// reload();
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

	return self;
};