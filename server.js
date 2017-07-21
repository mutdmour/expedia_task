const path = require('path');
const express = require('express');
const request = require('request');
const url = require('url');
const _ = require('underscore');
const querystring = require('querystring');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res) {
	// console.log("yo")
 //    request.get("https://offersvc.expedia.com/offers/v2/getOffers?scenario=deal-finder&page=foo&uid=foo&productType=Hotel", function(err, res, body) { 
 //    	console.log(body) 
 //    })
    res.sendFile(__dirname + '/../dist/index.html');
});

app.get('/sup',function(req,res) {
	_res = res;
    // request.get("https://offersvc.expedia.com/offers/v2/getOffers?scenario=deal-finder&page=foo&uid=foo&productType=Hotel", function(err, res, body) { 
    // 	// console.log(body) 
    // 	// result = JSON.parse(body);
    // 	_res.write(body);
    // 	_res.end()
    // })
    var query = url.parse(req.url,true).query;
    _get("getOffers", query, function(err, res){
    	if (!err){
    		_res.write(res)
    		_res.end()
    	} else {
    		console.log("err",err)
    	}
    })
})

app.listen(PORT, error => {
    error
        ? console.error(error) : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
});

const baseUrl = "https://offersvc.expedia.com/offers/v2/"
const defaultOptions = {
	scenario:"deal-finder",
	page:"foo",
	uid:"foo",
	productType:"Hotel"
}

function endpoint(method, params){
	params = _.extend(defaultOptions, params);
    return baseUrl + method + "?" + querystring.stringify(params);
};

function _get(method, params, cb){
    var url = endpoint(method, params);
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            _handleResponse(body, cb);
        }
        else if(error){
            cb({error:"http request error", details : error});
        }
        else{
            cb({error:"http request error", details :{response : response,body : body}});
        }
    });
}

// https://github.com/Sdedelbrock/node-expedia-api/blob/master/lib/expedia.js
function _handleResponse(response, cb){
    var result;
    try{
        // result = JSON.parse(response);
        result = response;
    }
    catch (error){
        cb({error:"Error trying to parse response", details:{error:error, response:response}});
    }
    if(result && result.EanWsError){
        cb({error:result.EanWsError.verboseMessage, details:result.EanWsError});
    }
    else{
        cb(null, result);
    }
}