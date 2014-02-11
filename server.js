/********************\
 *      CONFIG      *
\********************/
	
var mongo = require('mongodb');
var express = require('express');
var spawn = require('child_process').spawn;
var query = require('./js/query');
var loader = require('./js/loader');

var app = express();
var child = spawn('node', ['grapher.js']);

child.stdout.on('data', function(data){
	var data = data.toString();
	console.log(data);
});
 
app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});

/********************\
 *      MONGO       *
\********************/

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true, fsync:true});
db = new Db('pages', server, {w:1});
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'pages' database");
    }
});

/********************\
 *      ROUTES      *
\********************/

app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

app.get('/api/pages', query.findAll);
app.get('/api/pages/category/:category', query.findAllByCategory);
app.get('/api/pages/:id', query.findById);
app.get('/api/pages/:id/posts', query.findPostsByPageId);
app.get('/api/posts/:id', query.findPostById);
app.get('/api/videos', query.findAllVideos);
app.get('/api/videos/:id', query.findVideoById);

app.get('/api/stats/pages', query.getStatsPages);
app.get('/api/stats/posts', query.getStatsPosts);
app.get('/api/stats/videos', query.getStatsVideos);


/********************\
 *      SERVER      *
\********************/
 
app.listen(3000);
console.log('Listening on port 3000...');


