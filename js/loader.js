
//var mongo = require('mongodb');
var graph = require('fbgraph');
var request = require('request');
var async = require('async');
var youtube_id = require('./youtube_id');



var setCountPagesPosts = function(callback, page_id, index){
	var posts_count = 0;
	var value = {};
	var cursor_posts = db.collection('posts').find({source_id:Number(page_id)}).count(function(err, count) {
		posts_count = count;
		value['posts_count'] = posts_count;
	    db.collection('pages', function(err, collection) {
			collection.update({page_id:page_id}, {'$set':value}, {upsert:true,safe:true}, function(err, result) {
	            if (err) {
	            	console.log(err)
	            	callback();
	            } else {
	            	console.log(index + ' | ' + page_id + ' = ' + posts_count);
	            	callback();
	            }
			});
	    });    
	});
};

var graphPage = function(callback, page_id) {
	var post_query = "SELECT page_id, name, about, categories, checkins, description, emails, fan_count, general_info, is_verified, keywords, location, type, username, talking_about_count, were_here_count, website, pic_cover FROM page WHERE page_id = " + page_id; 
	graph.fql(post_query, function(err, res) { 
        if (err) {
        	console.log(err);
        	callback();
        } else {
			var page = res.data[0];
			if (page==undefined){
				console.log('undefined');
			    callback();
			} else {
			    db.collection('pages', function(err, collection) {
					collection.update({page_id:res.data[0].page_id}, page, {upsert:true,safe:true}, function(err, result) {
			            if (err) {
			                console.log(err)
			            	callback();
			            } else {
			            	callback();
			            }
					});
			    }); 
			}
        }
	});
};

var graphPagePosts = function(callback, page_id) {
	var post_query = "SELECT post_id,message,attachment,comment_info,created_time, description, like_info, permalink, share_info, source_id,actor_id, type FROM stream WHERE source_id=" + page_id + " AND actor_id=" + page_id + " AND strpos(attachment.href,'youtu') >= 0 LIMIT 100"; 
	graph.fql(post_query, function(err, res) { 
        if (err) {
        	console.log(err);
        	callback();
        } else {
			var posts = res.data;
			async.eachLimit(posts,10,
				function(post, callback){
			    	var video_id = youtube_id.getYoutubeID(post.attachment.href);
					var value = {};
					value['video_id'] = video_id;
				    db.collection('posts', function(err, collection) {
						collection.update({post_id:post.post_id}, post, {upsert:true,safe:true}, function(err, result) {
				            if (err) {
				            	console.log(err)
				            } else { 
				            } 
						});
						collection.update({post_id:post.post_id}, {'$set':value}, {upsert:true,safe:true}, function(err, result) {
				            if (err) {
				            	console.log(err)
				            	callback();
				            } else {
				            	callback();
				            }
						});
				    });
				},
				function(err){
					callback(); 
				}
			);
        }
	});
};

var graphVideo = function(video_id, post_id, callback) {
	var post_id = post_id;
	var value = {};
	value['video_id'] = video_id;  
	request('https://www.googleapis.com/youtube/v3/videos?id=' + video_id + '&part=id,snippet,contentDetails,statistics,player,status,topicDetails&key=AIzaSyDjjM_jdG9Q_4aWKsvV7vmN9SaYzb0GcmA', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			video = JSON.parse(body);
			if(video.pageInfo.totalResults == 0) { 
			    db.collection('posts', function(err, collection) {
					collection.remove({post_id:String(post_id)}, function(err, result) {
			            if (err) {
			            	console.log(err)
							callback();
			            } 
			            else { 
							callback();
			            }
					});
			    });
			} else {
				video_summary = video.items[0];
			    db.collection('videos', function(err, collection) {
					collection.update({id:video_id}, video_summary, {upsert:true,safe:true}, function(err, result) {
			            if (err) {
			                console.log(err);
							callback();
			            } else {
			            	callback();
			            }
					});
			    });
			}
		} else {
			callback();
		}
	})
};  

exports.setCountPagesPosts = setCountPagesPosts;
exports.graphPage = graphPage;
exports.graphPagePosts = graphPagePosts;
exports.graphVideo = graphVideo;
