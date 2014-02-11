var getYoutubeID = function(video_url, callback){
	var youtubePattern = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[?=&+%\w-]*/ig;
	youtubePattern = video_url.replace(youtubePattern, '$1');
	youtubePattern = youtubePattern.toString().substring(0,11);
	//console.log(youtubePattern);
	return youtubePattern;
	callback(youtubePattern);
}
exports.getYoutubeID = getYoutubeID;