// var db = require("../lib/db");

// var OrganizationSchema = new db.Schema({
//     organization_name: String,
//     organization_owner_email: String,
//     date_created: Date
// });

// var Organization = db.mongoose.model("Organization", OrganizationSchema);

// module.exports.addOrganization = addOrganization;

// function addOrganization(organization_name, organization_owner_email, callback) {
//     var instance = new Organization();
//     instance.organization_name = organization_name;
//     instance.organization_owner_email = organization_owner_email;
//     instance.date_created = Date.now();
//     instance.save(function (err) {
//         if (err) {
//             callback(err);
//         } else {
//             callback(null, instance);
//         }
//     });
// }