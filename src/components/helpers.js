var querystring = require("querystring")

export function decodeURI(url){
    url = querystring.decode(url)
    return Object.keys(url)[0]
}