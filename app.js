var express = require('express'), 
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    dataBase = require('./db');

// Connect to MongoDB with mongoose

var connectOptions = { useMongoClient: true };
var db = mongoose.connect(dataBase.data(), connectOptions);


// Get the models
var Device = require('./models/deviceModel');

// Initiate Express
var app = express();

// Get suggeste/default port otherwise take Port 8000
var port = process.env.PORT || 8000;

// Tell express to use the bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// Assign the routes
deviceRouter = require('./Routes/deviceRoutes')(Device);

//CORS middleware
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// middleware for supported format
app.use('*', function(req,res,next){
    if(!req.accepts('application/json')){
        res.status(400).send('Unsuported format');
    } 
    else {
        next();
    }
})

// Use the routes in the app/API
app.use('/api/devices', deviceRouter);
// app.use('/api/rooms', roomRouter);


// Testing the base route
app.get('/', function(req, res){
    res.send('Welcome to my API');
});

// Create and run the application
app.listen(port, function(){
    console.log('Gulp is running my app on PORT: ' + port);
});