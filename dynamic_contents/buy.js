module.exports = {
	template_it: function (data, req, callback) {
		
		var url = require('url');

		var get_data = (url.parse(req.url, true)).query;

		data = data.replace('{{product_name}}', get_data.product_name);
		callback(data.replace('{{product_price}}', get_data.product_price));
  	}
};