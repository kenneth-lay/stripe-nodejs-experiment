module.exports = {
	template_it: function (data, req, callback) {

		var MongoClient = require('mongodb').MongoClient;
		
		var url = "mongodb://localhost:27017/mydb";

		MongoClient.connect(url, function(err, db) {
	  		if (err) throw err;
	  		db.collection("products").find({}).toArray(function(err, product_list) {
	    		if (err) throw err;
	    		db.close();

	    		var option_form = '';

	    		for (i = 0; i < product_list.length; i++) {
	    			option_form = option_form + '<option value = "' 
	    				+ product_list[i]._id + '_' + product_list[i].price + '">' 
	    				+ product_list[i].name 
	    				+ '</option>';
				}

				callback(data.replace('{{product_names}}', option_form));
	    	});
	    });
  	}
};