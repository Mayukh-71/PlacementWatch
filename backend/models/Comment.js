const mongoose = require("mongoose");

const commentSchema =
new mongoose.Schema(
{
    placementId:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    username:
    {
        type: String,
        required: true
    },

    text:
    {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model(
    "Comment",
    commentSchema
);