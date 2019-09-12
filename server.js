let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Configure Express, ejs and body parser
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(express.static('style'))
app.use(express.static('image'))
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(8080)

let Developer = require('./models/developer')
let Task = require('./models/task')

//Configure mongoose
let url = 'mongodb://localhost:27017/taskDB'
mongoose.connect(url, { useNewUrlParser: true }, function (err) {
    if (err) throw err
    console.log('Connect Successfully')
})

//Home page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html')
})

//Insert a developer
app.get('/newDeveloper', function (req, res) {
    res.sendFile(__dirname + '/views/newDeveloper.html')
})

app.post('/newDeveloper', function (req, res) {
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.fname,
            lastName: req.body.lname,
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    })
    developer.save(function (err) {
        if (err) throw err
    })
        res.redirect('listDeveloper')
})

//Get the developer list
app.get('/listDeveloper', function (req, res) {
    Developer.find({}, function (err, data) {
        res.render('listDeveloper', { developer: data })
    })
})

//Add a new task
app.get('/newTask', function (req, res) {
    res.sendFile(__dirname + '/views/newTask.html');
})

app.post('/newTask', function (req, res) {
    let task = new Task({
        _id: new mongoose.Types.ObjectId(),
        taskname: req.body.taskname,
        developer: ObjectId(req.body.assignto),
        dueDate:req.body.taskdue,
        taskStatus: req.body.taskstatus,
        taskDescription: req.body.taskdesc
    })
    task.save(function (err) {
        if (err) throw err
    })
        res.redirect('listTask')
})

//List Task
app.get('/listTask', function (req, res) {
    Task.find({}, function (err, data) {
        res.render('listTask.html', { taskDb: data })
    })
})

//Delete Task by Id
app.get('/deleteTaskID', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTaskID.html')
})
app.post('/deleteTaskID', function (req, res) {
    Task.deleteOne({ _id: req.body.taskid }, function (err, result) {
    })
    res.redirect('listTask')
})

//Delete All
app.get('/deleteAll', function (req, res) {
    res.sendFile(__dirname + '/views/deleteAll.html')
})
app.post('/deleteAll', function (req, res) {
    Task.deleteMany({ taskStatus: req.body.taskstatus }, function (err, result) {
        if (err) throw err
    })
    res.redirect('listTask')
})

//Update task
app.get('/updateTask', function (req, res) {
    res.sendFile(__dirname + '/views/updateTask.html')
})
app.post('/updateTask', function (req, res) {
    Task.updateOne({ _id: req.body.taskidold }, { $set: { taskStatus: taskDetails.taskstatusnew } }, function (err, result) { })
    if (err) throw err
    res.redirect('listTask')
})

//Extra Task
app.get('/getAllCompleted', function (req,res){
    res.sendFile(__dirname + '/views/getAllCompleted.html')
})

app.post('/getAllCompleted', function (req,res){
    let sortBy = {taskname : -1}
    Task.where({'taskStatus' : 'Complete'}).sort(sortBy).limit(3).exec(function (err, docs){
        console.log(docs)
        res.render('listAllCompleted.html', { taskDb: docs })
    })
   // res.redirect('listAllCompleted')
})