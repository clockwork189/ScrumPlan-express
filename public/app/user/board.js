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
    self.init = function () {
        initForm();
        drawScrumBoard(table_div);
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
            var tr = $("<tr />");
            $("<td />").text(i).appendTo(tr);
            
            getTodoTasks(boardObject[i]).appendTo(tr);
            getInProgressTasks(boardObject[i]).appendTo(tr);
            getVerifyTasks(boardObject[i]).appendTo(tr);
            getDoneTasks(boardObject[i]).appendTo(tr);
            tr.appendTo(table_div);
        }
    };

    var getTodoTasks = function (project) {
        var td = $("<td />");
        if(project.tasks.length > 0) {
            for(var i = 0; i < project.tasks.length; i++) {
                var task = project.tasks[i];
                if(task.status === "1") {
                    var div = createTaskDiv(task, task.priority);
                    div.appendTo(td);
                }
            }
        }
        return td;
    };

    var getInProgressTasks = function (project) {
        var td = $("<td />");
        if(project.tasks.length > 0) {
            for(var i = 0; i < project.tasks.length; i++) {
                var task = project.tasks[i];
                if(task.status === "2") {
                    var div = createTaskDiv(task, task.priority);
                    div.appendTo(td);
                }
            }
        }
        return td;
    };

    var getVerifyTasks = function (project) {
        var td = $("<td />");
        if(project.tasks.length > 0) {
            for(var i = 0; i < project.tasks.length; i++) {
                var task = project.tasks[i];
                if(task.status === "3") {
                    var div = createTaskDiv(task, task.priority);
                    div.appendTo(td);
                }
            }
        }
        return td;
    };

    var getDoneTasks = function (project) {
        var td = $("<td />");
        if(project.tasks.length > 0) {
            for(var i = 0; i < project.tasks.length; i++) {
                var task = project.tasks[i];
                if(task.status === "4") {
                    var div = createTaskDiv(task, task.priority);
                    div.appendTo(td);
                }
            }
        }
        return td;
    };

    var createTaskDiv = function (task, priority) {
        var div = $("<div />").addClass("task-box").addClass(status_object[priority]).text(task.name);
        div.append("<br/>");
        var delegatesString = "";
        //console.log(typeof task.delegates);
        // for(var n = 0; n < task.delegates.length; n++) {
            delegatesString = task.delegates;
        // }
        $("<small />").text(delegatesString).appendTo(div);

        return div;
    };

    return self;
};