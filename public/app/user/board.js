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
    };

    var initiateDraggability = function (container) {
        container.find('div').draggable({ revert: "invalid" });
        container.find('td').not('.project-title').droppable({
            activeClass: "active",
            hoverClass: "drag-over",
            accept: '.ui-draggable',
            drop: function( event, ui ) {
                moveTask( ui.draggable, $(this) );
            }
        });
        
        var moveTask = function (element, container) {
            var taskID = $(element).data('task');
            console.log(container.data("status"));
            console.log($(element).data("task"));
            console.log(container.parent("tr").data("project"));
            for(var i in boardObject) {
                if(boardObject[i].hasOwnProperty("tasks")) {
                    for(var n = 0; n < boardObject[i].tasks.length; n++) {

                    }
                }
            }
            // console.log(taskID);
            // var newTask = tasks[taskID];

            // newTask['status'] = container.data('status');
            // newTask['project'] = container.parent('tr').data('project');
            
            //scrumData.setTask(taskID, newTask);
        };
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
                    td.data("status", task.status);
                }
            }
        }
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
        return td;
    };

    var createTaskDiv = function (task, priority, project_name, task_status) {
        var div = $("<div />").addClass('task task-box ' + status_object[priority])
                            .text(task.name)
                            .attr("data-project_name", project_name)
                            .attr("data-task_status", task_status)
                            .data('task', task.name);
        div.append("<br/>");
        $("<small />").text(task.delegates).appendTo(div);

        return div;
    };

    return self;
};