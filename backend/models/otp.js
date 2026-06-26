const mongoose =
require("mongoose");

const otpSchema =
new mongoose.Schema(
{
    email:
    {
        type: String
    },

    otp:
    {
        type: String
    },

    expiresAt:
    {
        type: Date
    }
});

module.exports =
mongoose.model(
    "OTP",
    otpSchema
);