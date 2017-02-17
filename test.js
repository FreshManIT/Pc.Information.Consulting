var queryString = require('querystring');
var fRequest = require('./commonUtils/fRquest');
var maxcrypto = new(require('./commonUtils/AESHelper'))("Freshman");
var config = require('./config/default');
var crypto = require('crypto');
var http = require('http');
var rp = require('request-promise');
var data = {};
var options = {
    method: 'POST',
    url: config.apiUrl + '/Question/SearchQustionInfo?pageSize=10&id=1',
    json: true
};
// var test = function() {
rp('https://www.baidu.com/')
    .then(function(htmlString) {
        data.html = htmlString;
    })
    .then(function() {
        data.sss = 1;
    })
    .then(rp(options)
        .then(function(parsedBody) {
            data.apiUrl = parsedBody;
            console.log(parsedBody);
        }))
    .then(function() {
        // console.log(JSON.stringify(data));
        console.log("game over");
    })
    .catch(function(err) {
        console.log(err);
    });
// return data;
// }
// var dkaif = test();
console.log(JSON.stringify(data))
    // fRequest.postRequest(config.apiUrl + '/ChatInfoHistory/test', null);

// var postData = queryString.stringify({
//     'msg': 'Hello World!',
// });

// var options = {
//     hostname: 'localhost',
//     port: 46262,
//     path: '/api/ChatInfoHistory/AddChatInfo',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-from-urlencoded; charset=UTF-8'
//             // 'Content-Length': Buffer.byteLength("fromId=2&toId=1&groupId=0&contentType=1&content=data")
//     }
// };

// var req = http.request(options, (res) => {
//     console.log(`STATUS: ${res.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     res.setEncoding('utf8');
//     res.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`);
//     });
//     res.on('end', () => {
//         console.log('No more data in response.');
//     });
// });

// req.on('error', (e) => {
//     console.log(`problem with request: ${e.message}`);
// });

// // write data to request body
// req.write("fromId=2&toId=1&groupId=0&contentType=1&content=data");
// req.end();




// var encode = maxcrypto.AesEnCoding("郎月磊");
// console.log(encode);
// console.log(maxcrypto.AesDeCoding(encode));


// var getDetailInfoById = function(questionId) {
//     var detailData = {};
//     fRequest.getRequest(config.apiUrl + '/Question/SearchQustionInfo?pageSize=10&id=' + questionId, function(error, httpResponse, body) {
//         if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.length != 1) {
//             return detailData;
//         } else {
//             detailData = body.data[0];
//             console.log(JSON.stringify(detailData));
//             return detailData;
//         }
//     });
//     return detailData;
// };
// var data = getDetailInfoById(1);
// console.log(JSON.stringify(data));



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