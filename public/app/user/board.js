var Board = function() {
	var self = {};
	var table_div = ".scrum-board";
	var orgs = new Organizations();
	var projects = new Projects();
	var tasks = new Tasks();
	var mid = $("input[name=mid]").val();
	var maker = new Creator();
	var boardObj = {};

	self.init = function () {
		loadTemplates();
		loadProjectsTasks();
		initiateDraggability($(table_div));
		// reload();
	};

	var loadTemplates = function () {
		socket.emit("req-load-board-templates");
		socket.on("load-templates", function (templates) {
			for(var i = 0; i < templates.length; i++) {
				$("<script />")
					.prop({type: "text/template", id: templates[i].id})
					.html(templates[i].html)
					.appendTo($("body"));
			}
		});
	};

	var loadProjectsTasks = function () {
		orgs.init(mid);
		socket.on("reload", function (data) {
			drawBoard(data);
			boardObj = data;
		});
	};

	var drawBoard = function (obj) {
		var template = $("#board-template").html();
		var tpl = swig.compile(template)({organizations: obj});
		$(".board .display").html(tpl);
	};

	var initiateDraggability = function (container) {
		container.find('td').not('.project-title').sortable({
			connectWith: container.find('td').not('.project-title'),
			receive: function(event, ui) {
				moveTask(ui.item, $(this));
			}
		}).disableSelection();

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

	return self;
};

$(function() {
	var board = new Board();
	board.init();
});