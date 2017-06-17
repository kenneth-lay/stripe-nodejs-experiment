var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var actions = require('./actions.js');

function write_html(res, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
}

http.createServer(function (req, res) {

    var pathname = url.parse(req.url, true).pathname;
    pathname = pathname === '/' ? '/index' : pathname;

    if (pathname !== '/favicon.ico') {
        fs.readFile('.' + (pathname === '/index' ? '/index.html' : pathname + '.htm'), 'utf8', 
            function(err, data) {
                try {
                    var template_generator = require('./dynamic_contents' 
                        + pathname.replace(/\.[^.]+$/, '') + '.js');

                    template_generator.template_it(data, req, function(templated_data) {
                        data = templated_data;
                        
                        if (req.method == 'POST') {
                            var post_data = '';
                            req.on('data', function(chunk) {
                                post_data += chunk;
                            });

                            req.on('end', function() {
                                post_data = qs.parse(post_data);
                                var stripe = require("stripe")(post_data.secret_key);
                                
                                actions[post_data.action](stripe, post_data);
                            });
                        }

                        write_html(res, data);
                    });               
                }
                catch (err) {
                    write_html(res, data);
                }
            }
        );        
    }

}).listen(8080);