var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');
var exec = require('child_process').exec;
var Q = require('q');

var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index.jade');
});


var path_to_repo = "/Users/mbernardy/Desktop/adnxs/hbui/master/";


var cmd_tmpl = "git ls-tree -r -z --name-only HEAD -- %s | xargs -0 -n1 git blame --line-porcelain HEAD |grep  '^author '|sort|uniq -c|sort -nr  | grep '%s'"

var username = "Max Bernardy";

app.get('/tree', function(req, res){

	var rel_path = req.query.path;


	if (!rel_path) rel_path = "";

	var full_path = path.join(path_to_repo,rel_path);

	var node_promises = [];

	fs.readdir(full_path, function(err, files){
		if(err) return res.send(err);

		files.forEach(function(filename){
			var promise = Q.promise(function(resolve, reject){
				var node = {
					'id' : filename,
					'text' : filename
				};

				var path_to_file = path.join(full_path, filename);
				var stats = fs.statSync(path_to_file);
				node.children = stats.isDirectory();

				var rel_path_to_file = path.join(rel_path, filename);
				var command = util.format(cmd_tmpl, rel_path_to_file, username);
				//console.log("Git command ", command);
				exec(command, { cwd: path_to_repo, timeout: 300 }, function(err, stdout, stderr){
					if(err){
						console.log("got error running command", command);
						console.log("got error running command for path %s", rel_path_to_file, err, stderr);
						line_count = "error";
					}else{
						console.log("got stdout %s for path ", stdout, rel_path_to_file);
						line_count= stdout;
					}
					node.text += "(" + line_count + ")";
					resolve(node);
				});
				
			});

			node_promises.push(promise);
		});


		Q.all(node_promises).then(function(nodes){
			res.json(nodes);
		}, function(err){
			console.log(err);
			res.error(err);
		});
	})

})

app.listen(5000);