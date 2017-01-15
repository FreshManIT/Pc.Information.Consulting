var queryString=require('querystring');
var fRequest=require('./commonUtils/fRquest');
var maxcrypto=new (require('./commonUtils/mixCrypto'))("Freshman");
var config=require('./config/default');
var crypto=require('crypto');


var encode=maxcrypto.encrypt("郎月磊");
console.log(encode);
console.log(maxcrypto.decrypt(encode));







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