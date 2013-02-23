var SPMongo = require("../lib/db");

// var OrganizationSchema = new db.Schema({
//     organization_name: String,
//     organization_owner_email: String,
//     date_created: Date
// });


// Native Driver
exports.openDb = function() {
    SPMongo.db.open(function(err, db) {
    if(!err) {
        console.log("Connected to ScrumPlan database");
        SPMongo.db.collection('organizations', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The  collection doesn't exist. Creating it now...");
            }
        });
    }
    });
};

exports.findById = function(id, callback) {
    console.log('Retrieving organization: ' + id);
    SPMongo.db.collection('organizations', function(err, collection) {
        collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, organization) {
            if(err) {
                callback(err);
            } else {
                callback(null, organization);
            }
        });
    });
};

exports.findAll = function(callback) {
    SPMongo.db.collection('organizations', function(err, collection) {
        collection.find().toArray(function(err, organizations) {
            if(err) {
                callback(err);
            } else {
                callback(null, organizations);
            }
        });
    });
};

exports.addOrganization = function(organization, callback) {
    console.log('Adding organization: ' + JSON.stringify(organization));
    SPMongo.db.collection('organizations', function(err, collection) {
        collection.insert(organization, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.updateOrganization = function(id, organization, callback) {
    console.log('Updating organization: ' + id);
    console.log(JSON.stringify(organization));
    SPMongo.db.collection('organizations', function(err, collection) {
        collection.update({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, organization, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};

exports.deleteOrganization = function(id, callback) {
    console.log('Deleting organization: ' + id);
    SPMongo.db.collection('organizations', function(err, collection) {
        collection.remove({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    });
};
