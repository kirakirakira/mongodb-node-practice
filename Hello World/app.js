var express = require('express'),
    app = express(),
    engines = require('consolidate');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('hello', { name : 'kira what is up' });
});

app.use(function(req, res){
    res.sendStatus(404); 
});

var server = app.listen(process.env.PORT, process.env.IP, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
});
