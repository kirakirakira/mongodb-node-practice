var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({
    extended: true
}));

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
// var url = mongodb://(host):(port)/(name of database)
var url = 'mongodb://kembrekl-mongodb-node-practice-2387596:27017/test';

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', {
        error: err
    });
}

app.get('/', function(req, res, next) {
    res.render('movie');
});

app.post('/movies', function(req, res, next) {
    var title = req.body.title;
    var year = req.body.year;
    var imdb = req.body.imdb;

    if ((title == '') || (year == '') || (imdb == '')) {
        next('Please fill in all fields.');
    }
    else {
        res.send('Form is completed. You entered: ' + title + ' ' + year + ' ' + imdb + '.');
    }

    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', url);

            // do some work here with the database.
            var collection = db.collection('movie_collection');

            var movie = {
                'title': title,
                'year': year,
                'imdb': imdb
            };
            
            // To insert into database
            // https://docs.mongodb.org/getting-started/node/insert/?_ga=1.190417963.1647530439.1452531400
            collection.insert(movie, function(err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Inserted %d documents into the "movie_collection" collection. The document is inserted with _id:', result.length, result);
                    db.close();
                }
            });
        }
    });

});

app.use(errorHandler);

var server = app.listen(process.env.PORT, process.env.IP, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
