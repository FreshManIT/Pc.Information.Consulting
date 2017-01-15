var http=require('http');
var querystring=require('querystring');
var url=require('url');

//Request option.
var option={
    hostname:'',
    port:'',
    method:'GET',
    path:'',
    headers:{
        'Content-Type':'application/x-www-from-urlencoded; charset=UTF-8'
    }
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
    // console.log(option.port);
    var request=http.request(option,function(res){
        httpResponse=res;
        // console.log("Status:"+res.statusCode);
        // console.log("Hearder:"+JSON.stringify(httpResponse.headers));
        res.on('data',function(chunk){
            body=chunk;
            // console.log("Body:"+body);
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
    option.port=requestLinkObj.port;
    option.hostname=requestLinkObj.hostname;
    // console.log(option.port);
    option.method="POST";

    //Need post data.
    var postDataStr=querystring.stringify(data);
    var request=http.request(option,function(res){
        httpResponse=res;
        // console.log("Status:"+res.statusCode);
        // console.log("Hearder:"+JSON.stringify(httpResponse.headers));
        res.on('data',function(chunk){
            body=chunk;
            // console.log("Body:"+body);
            callback(this.error,httpResponse,body);
            return;
        });
        res.on("end",function(chunk){
            if(!chunk){
               this.error="interface return is null.please check interface data." ;
               callback(this.error,httpResponse,null);
               return;
            }
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