var queryString=require('querystring');
var fRequest=require('./commonUtils/fRquest');
// fRequest.getRequest('http://www.baidu.com',function(error,httpResponse,body){
//     console.log('error:'+JSON.stringify(error));
//     console.log('httpResponse:'+JSON.stringify(httpResponse.statusCode));
//     console.log('body:'+body);
// });

fRequest.postRequest('http://www.ly.com/youlun/AjaxCall_Cruise.aspx',{
    PageType:'SpecialPage',Type:'CruiseSpecialStatistic',
SpecialId:285,
UserId:47658096,
Url:'http://www.ly.com/youlun/'},function(error,httpResponse,body){
    // console.log('error:'+JSON.stringify(error));
    // console.log('httpResponse:'+JSON.stringify(httpResponse.statusCode));
    // console.log('body:'+body);
});