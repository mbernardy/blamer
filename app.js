var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index.jade');
});


var path_to_repo = "/Users/mbernardy/Desktop/adnxs/hbui/master/";

app.get('/tree', function(req, res){

	var rel_path = req.query.path;

	console.log("Got route ", rel_path);
	if (!rel_path) rel_path = "";

	var full_path = path.resolve(path_to_repo,rel_path);
	console.log("got full path", full_path);

	fs.readdir(full_path, function(err, files){
		if(err) return res.send(err);

		res.json(files.map(function(filename){
			var stats = fs.statSync(path.resolve(full_path, filename));
			console.log("For path %s got stats %b", filename, stats.isDirectory());
			return {
				'text' : filename,
				'id' : filename,
				'children' : stats.isDirectory()
			}
		}));
	})

})

app.listen(5000);