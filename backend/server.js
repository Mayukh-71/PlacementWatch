const User =require("./models/User");
const bcrypt =require("bcryptjs");
const jwt =require("jsonwebtoken");
const JWT_SECRET =process.env.JWT_SECRET;
const auth = require("./middleware/auth");
const dns = require("dns");
const { exec } = require("child_process");
require("dotenv").config();
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const Placement =
    require("./models/Placement");

app.use(express.json());
app.use(
    cors({
        origin: [
            "https://placement-watch.vercel.app",
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.get("/", (req, res) => {
    res.send("Welcome to PlacementWatch2 Backend");
});

app.get("/about", (req, res) => {
    res.send("This is PlacementWatch.");
});
app.get("/placements", async (req, res) => {

    try
    {
        const placements =
            await Placement.find();

        console.log(placements);

        res.json(placements);
    }
    catch(err)
    {
        res.status(500).json({
            error: err.message
        });
    }

});
app.post("/placements",auth,async (req,res)=> {

    try
    {
        const savedPlacement =
            await Placement.create(
            {
                ...req.body,

                submittedBy:
                    req.user.username
            });

        res.json({
            message:
                "Placement added successfully",
            placement:
                savedPlacement
        });
    }
    catch(err)
    {
        res.status(500).json({
            error: err.message
        });
    }

});
app.get("/stats", async (req, res) => {

    try
    {
        const placements =
            await Placement.find();

        const totalPlacements =
            placements.length;

        let totalCTC = 0;
        let highestCTC = 0;

        const companies =
            new Set();

        for(let i=0;i<placements.length;i++)
        {
            totalCTC += placements[i].ctc;

            highestCTC =
                Math.max(
                    highestCTC,
                    placements[i].ctc
                );

            companies.add(
                placements[i].company
            );
        }

        const averageCTC =
            totalPlacements === 0
            ? 0
            : totalCTC / totalPlacements;

        res.json({
            totalPlacements,
            averageCTC,
            highestCTC,
            totalCompanies:
                companies.size
        });
    }
    catch(err)
    {
        res.status(500).json({
            error: err.message
        });
    }
});
app.get("/company-stats", async (req,res)=>
{
    try
    {
        const placements =
            await Placement.find();

        const stats = {};

        for(let i=0;i<placements.length;i++)
        {
            const company =
                placements[i].company;

            if(!stats[company])
            {
                stats[company] = [];
            }

            stats[company].push(
                placements[i].ctc
            );
        }

        const result = [];

        for(const company in stats)
        {
            let sum = 0;

            for(let i=0;i<stats[company].length;i++)
            {
                sum += stats[company][i];
            }

            result.push(
            {
                company: company,

                avgCTC:
                    sum /
                    stats[company].length
            });
        }

        res.json(result);
    }
    catch(err)
    {
        res.status(500).json(
        {
            error: err.message
        });
    }
});
app.post("/register", async (req,res)=>
{
    try
    {
        console.log("Register route hit");

        const {username,password}
        = req.body;

        console.log("Data received");

        const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

        console.log("Password hashed");

        const user =
        await User.create(
        {
            username,
            password:
            hashedPassword
        });

        console.log("User created");

        res.json(
        {
            message:
            "User Registered"
        });
    }
    catch(err)
    {
        console.error(err);
        if(err.code === 11000)
        {
            return res.status(400)
            .json(
            {
                error:
                "Username already exists"
            });
        }
        res.status(500).json(
        {
            error: err.message
        });
    }
});
app.post("/login", async (req,res)=>
{
    try
    {
        const {username,password}
        = req.body;

        const user =
        await User.findOne(
        {
            username
        });

        if(!user)
        {
            return res.status(400)
            .json(
            {
                error:
                "User not found"
            });
        }

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch)
        {
            return res.status(400)
            .json(
            {
                error:
                "Invalid password"
            });
        }

        const token =
        jwt.sign(
        {
            id: user._id,
            username:
            user.username
        },
        JWT_SECRET,
        {
            expiresIn:
            "7d"
        });

        res.json(
        {
            message:
            "Login successful",

            token
        });
    }
    catch(err)
    {
        res.status(500)
        .json(
        {
            error:
            err.message
        });
    }
});
app.get(
"/my-placements",
auth,
async (req,res)=>
{
    try
    {
        const placements =
        await Placement.find(
        {
            submittedBy:
            req.user.username
        });

        res.json(
            placements
        );
    }
    catch(err)
    {
        res.status(500)
        .json({
            error:
            err.message
        });
    }
});
app.get(
"/company/:name",
async (req,res)=>
{
    try
    {
        const companyName =
            req.params.name;

        const placements =
        await Placement.find(
        {
            company:
            companyName
        });

        res.json(
            placements
        );
    }
    catch(err)
    {
        res.status(500).json(
        {
            error:
            err.message
        });
    }
});
app.get(
"/placement/:id",
async (req,res)=>
{
    try
    {
        const placement =
        await Placement.findById(
            req.params.id
        );

        res.json(
            placement
        );
    }
    catch(err)
    {
        res.status(500).json(
        {
            error:
            err.message
        });
    }
});
app.put(
"/placement/:id",
auth,
async (req,res)=>
{
    try
    {
        const placement =
        await Placement.findById(
            req.params.id
        );

        if(!placement)
        {
            return res.status(404)
            .json({
                error:
                "Placement not found"
            });
        }

        if(
        placement.submittedBy
        !==
        req.user.username
        )
        {
            return res.status(403)
            .json({
                error:
                "Not authorized"
            });
        }

        const updated =
        await Placement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);
    }
    catch(err)
    {
        res.status(500).json({
            error:
            err.message
        });
    }
});
app.delete(
"/placement/:id",
auth,
async (req,res)=>
{
    try
    {
        const placement =
        await Placement.findById(
            req.params.id
        );

        if(!placement)
        {
            return res.status(404)
            .json({
                error:
                "Placement not found"
            });
        }

        if(
        placement.submittedBy
        !==
        req.user.username
        )
        {
            return res.status(403)
            .json({
                error:
                "Not authorized"
            });
        }

        await Placement.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:
            "Placement deleted"
        });
    }
    catch(err)
    {
        res.status(500).json({
            error:
            err.message
        });
    }
});
const Comment =
require("./models/Comment");
app.get(
"/comments/:placementId",
async (req,res)=>
{
    try
    {
        const comments =
        await Comment.find(
        {
            placementId:
            req.params.placementId
        });

        res.json(
            comments
        );
    }
    catch(err)
    {
        res.status(500).json(
        {
            error:
            err.message
        });
    }
});
app.post(
"/comments",
auth,
async (req,res)=>
{
    try
    {
        const comment =
        await Comment.create(
        {
            placementId:
            req.body.placementId,

            text:
            req.body.text,

            username:
            req.user.username
        });

        res.json(
            comment
        );
    }
    catch(err)
    {
        res.status(500).json(
        {
            error:
            err.message
        });
    }
});
app.delete(
"/user",
auth,
async (req,res)=>
{
    try
    {
        const username =
            req.user.username;

        await Placement.deleteMany(
        {
            submittedBy:
            username
        });

        await User.deleteOne(
        {
            username:
            username
        });

        res.json(
        {
            message:
            "Account and all placements deleted successfully"
        });
    }
    catch(err)
    {
        res.status(500).json(
        {
            error:
            err.message
        });
    }
});
const nodemailer =
require("nodemailer");
const transporter =
nodemailer.createTransport(
{
    service: "gmail",

    auth:
    {
        user:
        process.env.EMAIL_USER,

        pass:
        process.env.EMAIL_PASS
    }
});
const OTP =
require("./models/otp");
app.post(
"/send-otp",
async (req,res)=>
{
    try
    {
        const
        {
            email,
            username
        }
        = req.body;

        const existingUser =
        await User.findOne(
        {
            $or:
            [
                {email},
                {username}
            ]
        });

        if(existingUser)
        {
            return res.status(400)
            .json(
            {
                error:
                "Username or Email already exists"
            });
        }

        const otp =
        Math.floor(
            100000 +
            Math.random()*900000
        ).toString();

        await OTP.create(
        {
            email,
            otp,

            expiresAt:
            new Date(
                Date.now()
                + 5*60*1000
            )
        });

        await transporter.sendMail(
        {
            from:
            process.env.EMAIL_USER,

            to:
            email,

            subject:
            "PlacementWatch OTP Verification",

            text:
            `Your OTP is ${otp}. Valid for 5 minutes.`
        });

        res.json(
        {
            message:
            "OTP Generated"
        });
    }
    catch(err)
    {
        res.status(500)
        .json(
        {
            error:
            err.message
        });
    }
});
app.post(
"/verify-register",
async (req,res)=>
{
    try
    {
        const
        {
            email,
            username,
            password,
            otp
        } = req.body;

        const otpRecord =
        await OTP.findOne(
        {
            email,
            otp
        });

        if(!otpRecord)
        {
            return res.status(400)
            .json(
            {
                error:
                "Invalid OTP"
            });
        }

        if(
        otpRecord.expiresAt
        <
        new Date()
        )
        {
            return res.status(400)
            .json(
            {
                error:
                "OTP Expired"
            });
        }

        const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

        await User.create(
        {
            email,
            username,
            password:
            hashedPassword,

            isVerified:
            true
        });

        await OTP.deleteMany(
        {
            email
        });

        res.json(
        {
            message:
            "Registration Successful"
        });
    }
    catch(err)
    {
        if(err.code === 11000)
        {
            return res.status(400)
            .json(
            {
                error:
                "Username or Email already exists"
            });
        }

        res.status(500)
        .json(
        {
            error:
            err.message
        });
    }
});
app.post(
"/forgot-password",
async (req,res)=>
{
    try
    {
        const {email}
        = req.body;

        const user =
        await User.findOne(
        {
            email
        });

        if(!user)
        {
            return res.status(400)
            .json(
            {
                error:
                "Email not registered"
            });
        }

        const otp =
        Math.floor(
            100000 +
            Math.random()*900000
        ).toString();

        await OTP.create(
        {
            email,

            otp,

            expiresAt:
            new Date(
                Date.now()
                + 5*60*1000
            )
        });

        await transporter.sendMail(
        {
            from:
            process.env.EMAIL_USER,

            to:
            email,

            subject:
            "PlacementWatch Password Reset OTP",

            text:
            `Your OTP is ${otp}`
        });

        res.json(
        {
            message:
            "OTP Sent"
        });
    }
    catch(err)
    {
        res.status(500)
        .json(
        {
            error:
            err.message
        });
    }
});
app.post(
"/reset-password",
async (req,res)=>
{
    try
    {
        const
        {
            email,
            otp,
            newPassword
        }
        = req.body;

        const otpRecord =
        await OTP.findOne(
        {
            email,
            otp
        });

        if(!otpRecord)
        {
            return res.status(400)
            .json(
            {
                error:
                "Invalid OTP"
            });
        }

        if(
        otpRecord.expiresAt
        <
        new Date()
        )
        {
            return res.status(400)
            .json(
            {
                error:
                "OTP Expired"
            });
        }

        const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );

        await User.updateOne(
        {
            email
        },
        {
            password:
            hashedPassword
        });

        await OTP.deleteMany(
        {
            email
        });

        res.json(
        {
            message:
            "Password Reset Successful"
        });
    }
    catch(err)
    {
        res.status(500)
        .json(
        {
            error:
            err.message
        });
    }
});
app.get("/ml-data", async (req,res)=>
{
    const placements =
    await Placement.find();

    res.json(placements);
});
const { spawn } = require("child_process");

app.post(
"/predict-ctc",
(req,res)=>
{
    const py =
    spawn(
        "python",
        ["AI/predict_ctc.py"]
    );

    py.stdin.write(
        JSON.stringify(req.body)
    );

    py.stdin.end();

    let result = "";
    let errorOutput = "";

    py.stdout.on(
        "data",
        data =>
        {
            result += data.toString();
        }
    );

    py.stderr.on(
        "data",
        data =>
        {
            errorOutput += data.toString();
        }
    );

    py.on(
        "close",
        code =>
        {
            if(code !== 0)
            {
                return res.status(500)
                .json(
                {
                    error:
                    errorOutput
                });
            }

            res.json(
            {
                predictedCTC:
                result.trim()
            });
        }
    );
});
app.post(
"/predict-company",
(req,res)=>
{
    const py =
    spawn(
        "python",
        [
            "AI/predict_company.py"
        ]
    );

    py.stdin.write(
        JSON.stringify(
            req.body
        )
    );

    py.stdin.end();

    let result = "";

    py.stdout.on(
        "data",
        data =>
        {
            result +=
            data.toString();
        }
    );

    py.on(
        "close",
        () =>
        {
            res.json(
                JSON.parse(result)
            );
        }
    );
});
app.post(
"/retrain-models",
auth,
async (req,res)=>
{
    try
    {
        if(req.user.username !== "Mayukh_27")
        {
            return res.status(403)
            .json(
            {
                error:
                "Admin only"
            });
        }

        exec(
        "python AI/export_csv.py",
        (err1)=>
        {
            if(err1)
            {
                return res.status(500)
                .json(
                {
                    error:
                    "CSV export failed"
                });
            }

            exec(
            "python AI/train_ctc.py",
            (err2)=>
            {
                if(err2)
                {
                    return res.status(500)
                    .json(
                    {
                        error:
                        "CTC training failed"
                    });
                }

                exec(
                "python AI/train.py",
                (err3)=>
                {
                    if(err3)
                    {
                        return res.status(500)
                        .json(
                        {
                            error:
                            "Company training failed"
                        });
                    }

                    res.json(
                    {
                        message:
                        "Models retrained successfully"
                    });
                });
            });
        });
    }
    catch(err)
    {
        res.status(500)
        .json(
        {
            error:
            err.message
        });
    }
});
mongoose.connect(
process.env.MONGODB_URI
)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(3000, () => {
    console.log("Server running on port 3000");
});
})
.catch((err) => {
    console.error("MongoDB Error:");
    console.error(err);
});