$(function() {


	$('#root').jstree({
		core : {
			data : {
				url : "tree",
				data : function(node){
					console.log("Getting path for node ", node);
					var path = this.get_path(node, "/", true);
					console.log("Got path ", path );
					if (node.id  != "#"){
						console.log("Returning data ", path);
						return { path : path};
					}
				}
			}
		}
	});

});