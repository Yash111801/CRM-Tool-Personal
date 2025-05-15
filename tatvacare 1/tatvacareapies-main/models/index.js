const { URL } = require("../config");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = URL;
db.mongoose.plugin(mongoosePaginate);
db.users = require("./user.model")(mongoose);
db.companies = require("./company.model")(mongoose);
db.divisions = require("./division.model")(mongoose);
db.study = require("./study.model")(mongoose);
db.studyuseraccess = require("./studyuseraccess.model")(mongoose);
db.studyexceldata = require("./studyexceldata.model")(mongoose);
db.logs = require('./logs.model')(mongoose);
module.exports = db;