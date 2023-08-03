//create web server
//create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var Comment = require('./model/Comment');
var db = 'mongodb://localhost:27017/comments';
mongoose.connect(db);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/comments', function (req, res) {
    console.log('getting all comments');
    Comment.find({})
        .exec(function (err, comments) {
        if (err) {
            res.send('error occured')
        }
        else {
            console.log(comments);
            res.json(comments);
        }
    });
});
app.get('/comments/:id', function (req, res) {
    console.log('getting all comments');
    Comment.findOne({
        _id: req.params.id
    })
        .exec(function (err, comments) {
        if (err) {
            res.send('error occured')
        }
        else {
            console.log(comments);
            res.json(comments);
        }
    });
});
app.post('/comment', function (req, res) {
    var newComment = new Comment();
    newComment.username = req.body.username;
    newComment.body = req.body.body;
    newComment.save(function (err, comment) {
        if (err) {
            res.send('error saving comment');
        }
        else {
            console.log(comment);
            res.send(comment);
        }
    });
});
app.put('/comment/:id', function (req, res) {
    Comment.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            username: req.body.username,
            body: req.body.body
        }
    }, {
        upsert: true
    }, function (err, newComment) {
        if (err) {
            console.log('error occured');
        }
        else {
            console.log(newComment);
            res.send(newComment);
        }
    });
});
app.delete('/comment/:id', function (req, res) {
    Comment.findOneAndRemove({
        _id: req.params.id
    }, function (err, comment) {
        if (err) {
            res.send('error deleting');
        }
        else {
            console.log(comment);
            res.status(204);
        }
    });
});
app.listen(3000,