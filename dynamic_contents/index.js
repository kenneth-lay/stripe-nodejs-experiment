module.exports = {
	template_it: function (data, req, callback) {

	  	var fs = require('fs');
		var MongoClient = require('mongodb').MongoClient;
		
		var url = "mongodb://localhost:27017/mydb";

		MongoClient.connect(url, function(err, db) {
	  		if (err) throw err;
	  		db.collection("products").find({}).toArray(function(err, product_list) {
	    		if (err) throw err;
	    		db.close();
			    var table = '<table>';

			  	fs.readFile('./dynamic_contents/elements/product-list.htm', 'utf8', 
			  		function(err, tpl) {
			  		
				  		for (i = 0; i < product_list.length; i++) {
				  			var tpl_filled = tpl.replace(/\{\{product_name\}\}/g, product_list[i].name);
				  			tpl_filled = tpl_filled.replace(/\{\{product_price\}\}/g, product_list[i].price);
				  			table = table + tpl_filled;
				  		}

				  		callback(data.replace('{{product_list}}', table) + '</table>');
			  		}
			  	);
	  		});
		});
  	}
};