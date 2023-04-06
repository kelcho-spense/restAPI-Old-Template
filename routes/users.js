const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");

// GET USERS
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET USER
router.get("/user/:id", async (req, res) => {
    try {
        const users = await User.findById(req.params.id);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});
//REGISTER USER
router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (!existingUser) {
            const existingEmail = await User.findOne({ email: req.body.email });
            if (!existingEmail) {
                const newUser = new User({
                    fullname: req.body.fullname,
                    age: req.body.age,
                    gender: req.body.gender,
                    education_level: req.body.education_level,
                    gpa: req.body.gpa,
                    country: req.body.country,
                    photo: req.body.photo,
                    username: req.body.username,
                    email: req.body.email,
                    password: CryptoJS.AES.encrypt(
                        req.body.password,
                        process.env.PASS_SEC
                    ).toString(),
                });
                try {
                    const savedUser = await newUser.save();
                    const { password, ...others } = savedUser._doc;
                    res.status(200).json(others);
                } catch (error) {
                    res.status(500).json(err);
                }
            } else {
                return res.status(401).send("Email already taken");
            }
        } else {
            return res.status(401).send("Username already taken");
        }
    } catch (err) {
        res.status(500).send("Server error");
    };
});
//UPDATE
router.put("/update/:id", async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }


});
//DELETE
router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router