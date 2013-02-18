$(function() {
    var board = new Board();
    board.init();
});

var Board = function() {
    var self = {};
    self.init = function () {
        initForm();
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
    return self;
};