$(function() {
	var open_icon = 'glyphicon glyphicon-folder-open';
	var close_icon = 'glyphicon glyphicon-folder-close';

	$('#root').jstree({
		core : {
			data : {
				url : "tree",
				data : function(node){
					var path = this.get_path(node, "/", true);
					if (node.id  != "#"){
						return { path : path};
					}
				},
				dataFilter : function(data, type){
					var results = JSON.parse(data);
					results.forEach(function(node){
						if (!node.children){
							node.type = 'file';
						}
					})
					return JSON.stringify(results);
				}
			}
		},
		types: {
			file : {
				icon : 'glyphicon glyphicon-file',
				valid_children : []
			},
			'default' : {
				icon : close_icon
			}
		},
		plugins : ['types']
	}).on('before_open.jstree after_close.jstree', function(e, data){
		var node = data.node;
		if(node.state && node.state.opened){
			data.instance.set_icon(node, open_icon);
		}else{
			data.instance.set_icon(node, close_icon);
		}
	})

});