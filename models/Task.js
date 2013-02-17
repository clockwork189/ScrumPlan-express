var db = require("../lib/db");

var WorkoutSchema = new db.Schema({
    username: String,
    workoutname: String,
    workoutday: Date,
    reps: Number,
    sets: Number,
    weight: Number,
    date_created: Date
});

var Workout = db.mongoose.model("Workouts", WorkoutSchema);

module.exports.addWorkout = addWorkout;
module.exports.getUsersWorkouts = getUsersWorkouts;

function addWorkout(username, workoutname, workoutday, reps, sets, weight, callback) {
    var instance = new Workout();
    instance.username = username;
    instance.workoutname = workoutname;
    instance.workoutday = workoutday;
    instance.reps = reps;
    instance.sets = sets;
    instance.weight = weight;
    instance.date_created = Date.now();

    instance.save(function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, instance);
        }
    });
}

function getUsersWorkouts(username, callback) {
    Workout.find({username: username}, function (err, workouts) {
        if(err) {
            console.log("Error:", err);
        } else {
            callback(workouts);
        }
    });
}


