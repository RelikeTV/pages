/**
 * NEEDED API :
 */


var mongo = require('mongodb');

exports.getStatsPages = function(req, res) {
	var cursor_pages = db.collection('pages').count(function(err, count) {
		console.log('Pages = ' + count);
		var object = {};
		object['value'] = count;
		res.json(object);
	});
};

exports.getStatsPosts = function(req, res) {
	var cursor_posts = db.collection('posts').count(function(err, count) {
		console.log('Posts = ' + count);
		var object = {};
		object['value'] = count;
		res.json(object);
	});
};

exports.getStatsVideos = function(req, res) {
	var cursor_videos = db.collection('videos').count(function(err, count) {
		console.log('Videos = ' + count);
		var object = {};
		object['value'] = count;
		res.json(object);
	});
};

exports.findAll = function(req, res) {
	console.log('Find All Pages');
	var skip = "0";
	var limit = "10";
	var query_order = "";
	var order = {fan_count:-1};
	if (req.query.skip){
		skip=req.query.skip;
	};
	if (req.query.limit){
		limit=req.query.limit;
	};
	if (req.query.order){
		order={};
		order[req.query.order] = -1;
	};
	if (req.query.asc){ 
		order={};
		if (req.query.asc == "true"){
			console.log('true');
			order[req.query.order] = 1;
		};
		if (req.query.asc == "false"){
			console.log('false');
			order[req.query.order] = -1;
		};
	};
	db.collection('pages', function(err, collection) {
		collection.find({"posts_count":{$gte:5}}).limit(Number(limit)).skip(Number(skip)).sort(order).toArray(function(err, items) {
			//res.send(order);
			res.json(items);
			console.log('Find All Pages = ' + items.length);
		});
	});
};

exports.findAllByCategory = function(req, res) {
	var category = req.params.category;
	console.log(category);
	db.collection('pages', function(err, collection) {
		collection.find({type:category}).limit(10).sort({fan_count:-1}).toArray(function(err, items) {
			res.json(items);
			console.log('Find All Pages = ' + items.length);
		});
	});
};

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Find Page By Page ID : ' + id);
	db.collection('pages', function(err, collection) {
		collection.findOne({page_id:Number(id)}, function(err, item) {
			res.json(item);
		});
	});
};

exports.findPostsByPageId = function(req, res) {
	var id = req.params.id;
	console.log('Find Posts By Page ID : ' + id);
	db.collection('posts', function(err, collection) {
		collection.find({source_id:Number(id)}).toArray(function(err, items) {
			res.json(items);
			console.log('Find All Posts = ' + items.length);
		});
	});
};

exports.findPostById = function(req, res) {
	var id = req.params.id;
	console.log('Find Video By Video ID : ' + id);
	db.collection('posts', function(err, collection) {
		collection.findOne({post_id:String(id)}, function(err, item) {
			res.json(item);
		});
	});
};

exports.findVideoById = function(req, res) {
	var id = req.params.id;
	console.log('Find Video By Video ID : ' + id);
	db.collection('videos', function(err, collection) {
		collection.findOne({id:String(id)}, function(err, item) {
			res.json(item);
		});
	});
};
 
exports.findAllVideos = function(req, res) {
	console.log('Find All Videos');
	var skip = "0";
	var limit = "10";
	var query_order = "";
	var order = {fan_count:-1};
	if (req.query.skip){
		skip=req.query.skip;
	};
	if (req.query.limit){
		limit=req.query.limit;
	};
	if (req.query.order){
		order={};
		order[req.query.order] = -1;
	};
	if (req.query.asc){ 
		order={};
		if (req.query.asc == "true"){
			console.log('true');
			order[req.query.order] = 1;
		};
		if (req.query.asc == "false"){
			console.log('false');
			order[req.query.order] = -1;
		};
	};
	db.collection('videos', function(err, collection) {
		collection.find().limit(Number(limit)).skip(Number(skip)).sort(order).toArray(function(err, items) {
			//res.send(order);
			res.json(items);
			console.log('Find All Videos = ' + items.length);
		});
	});
};
