var http=require('http');
var querystring=require('querystring');
var url=require('url');

//Request option.
var option={
    hostname:'',
    port:'80',
    method:'GET',
    path:'',
    headers:{
        'Content-Type':'application/x-www-from-urlencoded; charset=UTF-8'
    },
    timeout:3000
};

//get interface data.path is url link,callback is callback function.
var getRequest=function(path,callback){
    var error=null;
    var httpResponse=null;
    var body=null;
    if(!path){
        error=new Error('The path is undefault or empty.');
        callback(error,httpResponse,body);
        return;
    }
    option.path=path;
    var requestLinkObj=url.parse(path);
    option.port=requestLinkObj.port;
    option.hostname=requestLinkObj.hostname;
    var request=http.request(option,function(res){
        httpResponse=res;
        res.on('data',function(chunk){
            body= eval('(' + chunk + ')');
            callback(this.error,httpResponse,body);
            return;
        });
    });
    request.on('error',function(error){
        this.error=error;
        callback(this.error,httpResponse,body);
        return;
    });
    request.end();
};

//post interface data.path is url link,callback is callback function.
var postRequest=function(path,data,callback){
    var error=null;
    var httpResponse=null;
    var body=null;
    if(!path){
        error=new Error('The path is undefault or empty.');
        callback(error,httpResponse,body);
        return;
    }
    option.path=path;    
    var requestLinkObj=url.parse(path);
    option.port=requestLinkObj.port || 80;
    option.hostname=requestLinkObj.hostname;
    option.method="POST";
    //Need post data.
    var postDataStr=querystring.stringify(data);
    var request=http.request(option,function(res){
        httpResponse=res;
        res.on('data',function(chunk){
            body=chunk;
            callback(this.error,httpResponse,body);
            return;
        });
    });
    request.on('error',function(error){
        this.error=error;
        callback(this.error,httpResponse,body);
        return;
    });
    request.write(postDataStr);
    request.end();
};

var requestWay={
    getRequest:getRequest,
    postRequest:postRequest
};

module.exports=requestWay;