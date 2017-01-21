var queryString = require('querystring');
var fRequest = require('./commonUtils/fRquest');
var maxcrypto = new(require('./commonUtils/AESHelper'))("Freshman");
var config = require('./config/default');
var crypto = require('crypto');
var http = require('http');


// fRequest.postRequest(config.apiUrl + '/ChatInfoHistory/test', null);

var postData = queryString.stringify({
    'msg': 'Hello World!',
});

var options = {
    hostname: 'localhost',
    port: 46262,
    path: '/api/ChatInfoHistory/AddChatInfo',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-from-urlencoded; charset=UTF-8'
            // 'Content-Length': Buffer.byteLength("fromId=2&toId=1&groupId=0&contentType=1&content=data")
    }
};

var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write("fromId=2&toId=1&groupId=0&contentType=1&content=data");
req.end();




var encode = maxcrypto.AesEnCoding("郎月磊");
console.log(encode);
console.log(maxcrypto.AesDeCoding(encode));







// console.log(config.apiUrl);

// fRequest.getRequest(config.apiUrl+'/LoginUser/Login?userName=FreshMan&password=1',function(error,httpResponse,body){
//     console.log('error:'+JSON.stringify(error));
//     console.log('httpResponse:'+JSON.stringify(httpResponse.statusCode));
//     console.log('body:'+body);
// });

// fRequest.postRequest('http://www.ly.com/youlun/AjaxCall_Cruise.aspx',{
//     PageType:'SpecialPage',Type:'CruiseSpecialStatistic',
// SpecialId:285,
// UserId:47658096,
// Url:'http://www.ly.com/youlun/'},function(error,httpResponse,body){
// console.log('error:'+JSON.stringify(error));
// console.log('httpResponse:'+JSON.stringify(httpResponse.statusCode));
// console.log('body:'+body);
// });