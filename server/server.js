// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
 
// Configuration
mongoose.connect('mongodb://localhost/reviewking');
 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
// Models

var Sale = mongoose.model('Sale', {
    name: String,
    shortname: String,
    title: String,
    description: String,
    startdate: Date,
    enddate: Date
});

var Collection = mongoose.model('Collection', {
    name: String,
    shortname: String,
    title: String,
    description: String,
    startdate: Date,
    enddate: Date
});
 
// Routes
    app.get('/api/sales', function(req, res) {
        console.log("fetching sales");
        Sale.find(function(err, sales) {
            if (err)
                res.send(err)
            res.json(sales); // return all sales in JSON format
        });
    });
      
    // app.get('/api/salesongoing', function(req, res) {
    //     console.log("fetching sales");
    //     Sale.find({'status' : 'ongoing'}, function(err, sales) {
    //         if (err)
    //             res.send(err)
    //         res.json(sales); // return all sales in JSON format
    //     });
    // });

    // app.get('/api/salesupcoming', function(req, res) {
    //     console.log("fetching sales");
    //     Sale.find({'status' : 'upcoming'}, function(err, sales) {
    //         if (err)
    //             res.send(err)
    //         res.json(sales); // return all sales in JSON format
    //     });
    // });

    app.post('/api/sales', function(req, res) {
        console.log("creating sale");
        Sale.create({
            name : req.body.name,
            shortname : req.body.shortname,
            title : req.body.title,
            description : req.body.description,
            startdate : req.body.startdate,
            enddate : req.body.enddate,
            done : false
        }, function(err, sale) {
            if (err)
                res.send(err);
            Sale.find(function(err, sales) {
                if (err)
                    res.send(err)
                res.json(sales);
            });
        });
    });
 
    app.delete('/api/sales/:sale_id', function(req, res) {
        Sale.remove({
            _id : req.params.sale_id
        }, function(err, sale) {
        });
    });

    //////////////////////////////////////////////////

    app.get('/api/collections', function(req, res) {
        console.log("fetching collections");
        Collection.find(function(err, collections) {
            if (err)
                res.send(err)
            res.json(collections); // return all collections in JSON format
        });
    });

    app.post('/api/collections', function(req, res) {
        console.log("creating collection");
        Collection.create({
            name : req.body.name,
            shortname : req.body.shortname,
            title : req.body.title,
            description : req.body.description,
            startdate : req.body.startdate,
            enddate : req.body.enddate,
            done : false
        }, function(err, collection) {
            if (err)
                res.send(err);
            Collection.find(function(err, collections) {
                if (err)
                    res.send(err)
                res.json(collections);
            });
        });
    });
 
    app.delete('/api/collections/:collection_id', function(req, res) {
        Collection.remove({
            _id : req.params.collection_id
        }, function(err, collection) {
        });
    });



    /////////////////
 
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");