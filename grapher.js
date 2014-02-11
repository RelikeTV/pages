/********************\
 *      CONFIG      *
\********************/
	
var mongo = require('mongodb');
var graph = require('fbgraph');
var async = require('async');
var spawn = require('child_process').spawn;
var query = require('./js/query');
var loader = require('./js/loader');

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
        console.log("Child connected to 'pages' database");
		clean_database();
		load_pages();
		//update_database();
    }
});


graph.setAccessToken('188012464555213|h3ej8qbrZZayEYYyWPghOvUYYTk');

/********************\
 *     FUNCTION     *
\********************/

var load_pages = function(){
	var pagelist = require('./data/pages_top1000.json');
	async.eachLimit(pagelist, 10,
		function(item, callback){
			async.waterfall([
			    function(callback){
			    	loader.graphPage(function (){callback();},item.fb_id);
			    },
			    function(callback){
			        loader.graphPagePosts(function (){callback();},item.fb_id);
			    },
			    function(callback){
			        graph_posts_video(function (){callback();},item.fb_id);
			    }
			],
			function(err, results){
				loader.setCountPagesPosts(function (){callback();},item.fb_id);
			});
		},
		function(err){
			finish();
		}
	);
};
 
var graph_posts_video = function(callback, page_id) {
	var posts = {};
	var posts = db.collection('posts').find({source_id:Number(page_id)}).toArray(function(err, items) {
		//console.log('Find All Posts = ' + items.length);
		async.eachLimit(items,20,
			function(item, callback){
				//graph_video(item.attachment.href, item.post_id, function(err){callback();});
				loader.graphVideo(item.video_id, item.post_id, function(err){callback();});
			},
			function(err){
				callback();
			}
		);
	});
};

/********************\
 *     FUNCTION     *
\********************/

var finish = function(){
	console.log("Everything is done.");
};

var clean_database = function(){
	db.collection("pages").remove({},function(err,numberRemoved){
		console.log("Pages Removed : " + numberRemoved);
	});
	db.collection("posts").remove({},function(err,numberRemoved){
		console.log("Posts Removed : " + numberRemoved);
	});
	db.collection("videos").remove({},function(err,numberRemoved){
		console.log("Videos Removed : " + numberRemoved);
	});
};

 
