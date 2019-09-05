var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemas = {
    socialMediaSchema: new Schema({
        url: {type: String}
    })
};

module.exports = schemas;