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
    res.sendFile(__dirname + '/../dist/index.html');
});

app.get('/getOffers',function(req,res) {
    _handleRequest(req, function(err, query) {
        if (!err){
            getOffers(query, res)
        }
    });
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
    params = _.extend({}, defaultOptions, params);
    return baseUrl + method + "?" + querystring.stringify(params);
};

function _get(method, params, cb){
    var url = endpoint(method, params);
    console.log(url)
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

function _handleResponse(response, cb){
    var result;
    try{
        result = JSON.parse(response);
        // result = response;
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

const params_schema = {
    lengthOfStay:{
        Flight:true,
        Hotel:true,
        type:Number
    },
    destinationName:{
        Flight:true,
        Hotel:true,
        type:String
    },
    minStarRating:{
        Flight:false,
        Hotel:true,
        type:Number,
        decimal:true
    },
    minGuestRating:{
        Flight:false,
        Hotel:true,
        type:Number,
        decimal:true
    },
    productType:{
        allowedValues:['Flight', 'Hotel'],
        type:String,
        required:true
    }
}

function _handleRequest(req, cb){
    var query = url.parse(req.url,true).query;
    var newQuery = {};
    for (k in params_schema){
        if (params_schema[k].required && (query[k] === null || query[k] === undefined)){
            cb({error:"Error while validating query. Missing required key ["+k+"]"});
        }
        if (query[k] !== null && query[k] !== undefined){
            var allowedValues = params_schema[k].allowedValues;
            if (allowedValues && !allowedValues.indexOf(query[k])){
                cb({error:"Error while validating query. Key ["+k+"] cannot have value ["+query[k]+"]"});
            }
        
            var requiredType = params_schema[k].type;
            if (requiredType !== typeof query[k]){
                cb({error:"Error while validating query. Key ["+k+"] must be of type "+params_schema[k].type});
            } else if (requiredType === Number && !params_schema[k].decimal){
                query[k] = parseInt()
            }

            if (isOfValidProductType(k, query["productType"])){
                newQuery[k] = query[k];
            }
        }
    }
    // console.log(query, newQuery);
    cb(undefined,newQuery);
}

function isOfValidProductType(key, type){
    if (key === "productType"){
        return true;
    } 
    return params_schema[key][type];
}

function getOffers(query, _res){
    _get("getOffers", query, function(err, res){
        if (!err){
            if (!_res.finished){
              _res.json({data:res['offers']})
            }
        } else {
            console.log("err",err)
        }
    });
}