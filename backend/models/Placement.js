const mongoose = require("mongoose");

const placementSchema =
new mongoose.Schema({

    company:
    {
        type: String,
        required: true
    },

    role:
    {
        type: String,
        required: true
    },

    ctc:
    {
        type: Number,
        required: true
    },

    cgpa:
    {
        type: Number
    },

    department:
    {
        type: String
    },

    year:
    {
        type: Number
    },

    difficulty:
    {
        type: Number
    },

    oaExperience:
    {
        type: String
    },

    interviewExperience:
    {
        type: String
    },

    submittedBy:
    {
        type: String
    }

});

module.exports =
mongoose.model(
    "Placement",
    placementSchema
);