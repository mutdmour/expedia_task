/**
 * Module dependencies.
 */
const url = require('url');
const _ = require('underscore');
const querystring = require('querystring');
const request = require('request');

/**
 * Schema for API params to validate. 
 * Flight and Hotel indicate if they can be used with their respective types.
 */
const params_schema = {
    lengthOfStay:{
        Flight:true,
        Hotel:true,
        type:Number
    },
    destinationCity:{
        Flight:true,
        Hotel:false,
        type:String
    },
    destinationName:{
        Flight:false,
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
const baseUrl = "https://offersvc.expedia.com/offers/v2/"
const defaultOptions = {
	scenario:"deal-finder",
	page:"foo",
	uid:"foo",
}

/**
 * Handle API requests and respond wtih offers.
 */
function handleAPIRequest(req,res){
    _handleRequest(req, function(err, query) {
        if (!err){
            getOffers(query, res)
        }
    });
}

/**
 * Construct string of expedia API endpoint to connect to.
 */
function endpoint(method, params){
    params = _.extend({}, defaultOptions, params);
    return baseUrl + method + "?" + querystring.stringify(params);
};

/**
 * Get request from Expedia API.
 */
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

/**
 * Handle response from Expedia API.
 */
function _handleResponse(response, cb){
    var result;
    try{
        result = JSON.parse(response);
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

/**
 * Validate request.
 */
 // XXX break up more
function _handleRequest(req, cb){
    var query = url.parse(req.url,true).query;
    var newQuery = {};
    var k;
    for (k in params_schema){
        if (params_schema[k].required && isEmpty(query[k])){
            cb({error:"Error while validating query. Missing required key ["+k+"]"});
        }
        if (!isEmpty(query[k])){
            var allowedValues = params_schema[k].allowedValues;
            if (allowedValues && !allowedValues.indexOf(query[k])){
                cb({error:"Error while validating query. Key ["+k+"] cannot have value ["+query[k]+"]"});
            }
        
            var requiredType = params_schema[k].type;
            if (requiredType !== typeof query[k]){
                cb({error:"Error while validating query. Key ["+k+"] must be of type "+params_schema[k].type});
            } else if (requiredType === Number && !params_schema[k].decimal){
                query[k] = parseInt();
            }

            if (isOfValidProductType(k, query["productType"])){
                newQuery[k] = query[k];
            }
        }
    }
    cb(undefined,newQuery);
}

function isEmpty(val){
    return val === null || typeof val === "undefined" || val === "";
}

/**
 * Check that param is valid for productType.
 */
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

module.exports = {handleAPIRequest:handleAPIRequest, _handleRequest:_handleRequest, getOffers:getOffers};
