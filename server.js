// set up ========================
var express  = require('express');
var app      = express();                            // create our app w/ express
var mongoose = require('mongoose');                  // mongoose for mongodb
var morgan = require('morgan');            
// log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

mongoose.connect('mongodb://localhost:27017/orders');
mongoose.connection.on('error', function() {
  console.log('← MongoDB Connection Error →');
});


app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// configuration =================

// define model =================

var Schema = mongoose.Schema;
var orderSchema = new Schema({
    text: String,
    done: Boolean
});

var Order = mongoose.model('Order', orderSchema);

// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/orders', function(req, res) {

        // use mongoose to get all todos in the database
        Order.find(function(err, orders) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(orders); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/orders', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Order.create({
            text : req.body.text,
            done : false
        }, function(err, order) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Order.find(function(err, orders) {
                if (err)
                    res.send(err)
                res.json(orders);
            });
        });

    });

    // delete a todo
    app.delete('/api/orders/:order_id', function(req, res) {
        Order.remove({
            _id : req.params.order_id
        }, function(err, order) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Order.find(function(err, orders) {
                if (err)
                    res.send(err)
                res.json(orders);
            });
        });
    });






// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        console.log(req.body.text);
    });



    // listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");