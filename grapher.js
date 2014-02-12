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
		//clean_database();
		load_pages();
		//console.log(Date());
		//update_database();
    }
});


graph.setAccessToken('188012464555213|h3ej8qbrZZayEYYyWPghOvUYYTk');

/********************\
 *     FUNCTION     *
\********************/

var load_pages = function(){
	var posts = db.collection('pageslist').find().toArray(function(err, pages) {
		async.eachLimit(pages, 5,
			function(item, callback){
				async.waterfall([
				    function(callback){
				    	loader.graphPage(function (){callback();},item.page_id);
				    },
				    function(callback){
				        loader.graphPagePosts(function (){callback();},item.page_id);
				    },
				    function(callback){
				        graph_posts_video(function (){callback();},item.page_id);
				    }
				],
				function(err, res){
					//console.log(pages.indexOf(item) + ' - ' + item.page_id + ' - ' + item.posts_count);
					//console.log(res);
					loader.setCountPagesPosts(function (){callback();},item.page_id,pages.indexOf(item));
				});
			},
			function(err){
				finish();
			}
		);
	});
};
 
var graph_posts_video = function(callback, page_id) {
	var posts = db.collection('posts').find({source_id:Number(page_id)}).toArray(function(err, items) {
		async.eachLimit(items,10,
			function(item, callback){
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

var update_database = function(){
	db.collection("pageslist").remove({},function(err,numberRemoved){
		console.log("Pages Removed : " + numberRemoved);
	});
	var pagelist = require('./data/pages_top100.json');
	async.eachLimit(pagelist, 5,
		function(page, callback){
			//console.log(item.fb_id);
			console.log(pagelist.indexOf(page));
			var value = {};
			value['page_id'] = page.fb_id;
			console.log(value);
		    db.collection('pageslist', function(err, collection) {
				collection.update({page_id:page.fb_id},value, {upsert:true,safe:true}, function(err, result) {
		            if (err) {
		                console.log(err);
		            } else {
		                console.log(pagelist.indexOf(item));
		            }
				});
				callback();
		    }); 
		},
		function(err){
			console.log('Update Database Finished');
		}
	);
};
 
