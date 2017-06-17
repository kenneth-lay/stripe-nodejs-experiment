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
  	}
};