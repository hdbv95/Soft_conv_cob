
var mongoose = require('mongoose');
var socialMediaSchema = require('../Schemas/SchemaSocialMedia').socialMediaSchema;

var models = {
    socialMedia: mongoose.model('tweet', socialMediaSchema)
};
module.exports = models;