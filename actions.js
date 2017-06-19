module.exports = {
	create_customer: function (stripe, post_data) {
		stripe.tokens.create({
	        card: {
	            "number": post_data.card_number,
	            "exp_month": post_data.exp_month,
	            "exp_year": post_data.exp_year,
	            "cvc": post_data.cvc
	        }
	    }, function(err, token) {
	        stripe.customers.create({
	            description: post_data.customer_name 
	                + " <" 
	                + post_data.customer_email 
	                + ">",
	            source: token.id
	        }, function(err, customer) {
	            if (err) {
	                console.log('Error creating customer!');
	            }
	            else {
	                console.log('Customer created');
	            }
	        });
	    });
  	},
  	create_charge: function (stripe, post_data) {
  		stripe.charges.create({
            amount: post_data.product_price,
            currency: 'usd',
            customer: post_data.customer_id,
            description: post_data.product_name
        }, function(err, charge) {
            if (err) {
                console.log('Error charging customer!');
            }
            else {
                console.log('Customer charged');
            }
    	});
  	},
  	create_plan_product: function (stripe, post_data) {

  		var plan_id = (post_data.plan_name.toLowerCase()).replace(/\s/g, '-') 
  				+ '-' 
  				+ ((+new Date) + Math.random()* 100).toString(32).slice(6, 9);

  		stripe.plans.create({
  			amount: ((post_data.product_name).split("_"))[1],
  			interval: post_data.plan_interval,
  			name: post_data.plan_name,
  			currency: "usd",
  			id: plan_id
		}, function(err, plan) {
  			if (err) {
                console.log('Error creating plan!');
            }
            else {
                var mongo = require('mongodb');
                var MongoClient = mongo.MongoClient;
		
				var url = "mongodb://localhost:27017/mydb";

				MongoClient.connect(url, function(err, db) {
	  				if (err) throw err;

	  				db.collection("products").update(
	  					{_id: (new mongo.ObjectID(((post_data.product_name).split("_"))[0]))}, 
	  					{ $set: { plan: plan_id } }, 
	  					function(err, res) {
	  						if (err) {
                				console.log('Error creating plan');
            				}
            				else {
                				console.log('Plan created');
            				}
	  					});
            	});
            }
		});
  	},
  	subscribe: function (stripe, post_data) {
  		stripe.subscriptions.create({
		 	customer: post_data.customer_id,
		 	plan: post_data.plan_id
		}, function(err, subscription) {
			if (err) {
				console.log('Error subscribing customer');
			}
			else {
				console.log('Customer subscribed');
			}
		});
  	}
};