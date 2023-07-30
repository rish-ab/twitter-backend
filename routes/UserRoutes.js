const express = require('express');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const app = express.Router();



app.post("/signup", (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        let user = new User({
            email: req.body.email,
            username: req.body.username,
            userId: req.body.userId,
            phoneNumber: req.body.phoneNumber,
            password: hash
        });
        user.save()
            .then((result) => {
                let us = {
                    id: result._id,
                    email: result.email
                };
                res.status(201).json({
                    msg: 1,
                    user: { ...result._doc, password: '' }
                });
            })
            .catch((err) => {
                res.status(500).json({
                    msg: -1,
                    content: err.message
                });
            });
    });

});




app.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(422).json({
                    msg: -1,
                    content: "Email does not exists"
                });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((result) => {
                        jwt.sign(
                            {
                                email: user.email,
                                userId: user._id
                            },
                            "Salt should be long",
                            {
                                expiresIn: '1h'
                            },
                            function (err, token) {
                                res.status(200).json({
                                    msg: 1,
                                    token: token
                                })
                            });

                    })
                    .catch((err) => {
                        res.status(422).json({
                            msg: -1,
                            content: "Password does not match"
                        });
                    })
            }
        })
        .catch((err) => {
            res.status(500).json({
                msg: -1,
                content: err.message
            });
        })


    // bcrypt.hash(req.body.password, 10, (err, hash) => {
    //     let user = new User({
    //         email: req.body.email,
    //         password: hash
    //     });
    //     user.save()
    //         .then((result) => {
    //             let us = {
    //                 id: result._id,
    //                 email: result.email
    //             };
    //             res.status(201).json({
    //                 msg: 1,
    //                 user: { ...result._doc, password: '' }
    //             });
    //         })
    //         .catch((err) => {
    //             res.status(500).json({
    //                 msg: -1,
    //                 content: err.message
    //             });
    //         });
    // });

});


module.exports = app;   