module.exports = {
	template_it: function (data, req, callback) {
		
		var url = require('url');

		var get_data = (url.parse(req.url, true)).query;

		data = data.replace(/\{\{product_name\}\}/g, get_data.product_name);
		callback(data.replace(/\{\{plan_id\}\}/g, get_data.plan_id));
  	}
};