// node main.js
const fs = require("fs");
const crypto = require('crypto');
const express = require('express');
const escape = require('escape-html')
var favicon = require('serve-favicon');
const app = express();

app.use(favicon('favicon.ico'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/login', async (req, res) => {
    try {
        console.info(`${req.socket.remoteAddress} ${req.headers['x-forwarded-for']} -- ${req.method} ${req.originalUrl}`);
        const { username, password,ㅤ} = req.query;

        // We changed all those passwords after Mr. Martin left the company
        const validUsers = [
            'admin:W7tgTzWTFBDedWf+OhrrqfLgYAh7blYh0RuhakKLKqQ=',
            'alice:K9gGyX8OAK8aH8Myj6djqSaXI8jbj6xPk69x2xhtbpA=',
            'bob:WsOfjLfA9phADg4FnzcUrtKOXc4hByHUsBpX02PvrSM=',ㅤ
        ];

        const hash = crypto.createHash('sha256').update(password).digest('base64');
        const check = username + ":" + hash;
        var login = "";
        validUsers.forEach(validPair => {
            if (check == validPair) {
                login = validPair.split(":")[0];
            }
        });

        if (login == "") {
            res.status(403);
            res.render("pages/feedback", {
                type: "warning",
                msg: "Authentication failed.",
            });
            return res.end();
        }

        if (login == "admin") {
            var flag = fs.readFileSync("flag.txt");
            res.status(200);
            res.render("pages/feedback", {
                type: "success",
                msg: "Welcome back admin! " + flag,
            });
            return res.end();
        }

        res.status(200);
        res.render("pages/feedback", {
            type: "success",
            msg: "Welcome back " + login + "!",
        });
        return res.end();

    } catch (e) {
        return res.redirect("/");
    }
});

app.get('/source', async (req, res) => {
    console.info(`${req.socket.remoteAddress} ${req.headers['x-forwarded-for']} -- ${req.method} ${req.originalUrl}`);
    const source = fs.readFileSync(__filename);
    res.render("pages/source", {
        source: escape(source),
    });
    return res.end();
});

app.get('/', async (req, res) => {
    console.info(`${req.socket.remoteAddress} ${req.headers['x-forwarded-for']} -- ${req.method} ${req.originalUrl}`);
    res.render("pages/index");
    return res.end();
});

app.use(function(req, res, next) {
    res.status(404);
    res.render("pages/feedback", {
        type: "warning",
        msg: "This page does not exist.",
    });
    res.end();
    return next();
});

app.listen(2153);