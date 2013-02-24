$(function() {
    var stats = new Stats();
    stats.init();
});

var Stats = function() {
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
        
    };

    return self;
};